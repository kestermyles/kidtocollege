"use client";

import { useState, useEffect, useRef, useCallback, DragEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { COLLEGES_SEED } from "@/lib/colleges-seed";
import {
  categoriseCollege,
  getCategoryLabel,
  type Category,
} from "@/lib/collegeListUtils";

const STATUS_OPTIONS = [
  { value: "researching", label: "Researching" },
  { value: "planning_to_apply", label: "Planning to apply" },
  { value: "applied", label: "Applied" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "enrolled", label: "Enrolled" },
];

interface ListItem {
  id: string;
  college_slug: string;
  category: Category;
  notes: string | null;
  application_status: string;
  colleges: {
    name: string;
    location: string;
    state: string;
    acceptance_rate: number | null;
    photo_url: string | null;
  } | null;
}

interface ListProfile {
  id: string;
  gpa: number | null;
  sat_score: number | null;
  act_score: number | null;
}

export default function MyListPage() {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [list, setList] = useState<ListProfile | null>(null);
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile inputs
  const [gpa, setGpa] = useState("");
  const [sat, setSat] = useState("");
  const [act, setAct] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  // College search
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Drag state
  const [dragId, setDragId] = useState<string | null>(null);

  const studentProfile = {
    gpa: gpa ? parseFloat(gpa) : null,
    sat: sat ? parseInt(sat) : null,
    act: act ? parseInt(act) : null,
  };

  const filteredColleges =
    searchQuery.length >= 2
      ? COLLEGES_SEED.filter(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !items.some((i) => i.college_slug === c.slug)
        ).slice(0, 8)
      : [];

  // Click outside dropdown
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Auth check + fetch list
  const fetchList = useCallback(async () => {
    const res = await fetch("/api/list");
    if (res.ok) {
      const data = await res.json();
      setList(data.list);
      setItems(data.items || []);
      if (data.list) {
        setGpa(data.list.gpa?.toString() || "");
        setSat(data.list.sat_score?.toString() || "");
        setAct(data.list.act_score?.toString() || "");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const signedIn = !!data.user;
      setIsSignedIn(signedIn);
      if (signedIn) fetchList();
      else setLoading(false);
    });
  }, [fetchList]);

  // Handlers
  async function saveProfile() {
    setProfileSaving(true);
    await fetch("/api/list/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gpa: gpa ? parseFloat(gpa) : null,
        satScore: sat ? parseInt(sat) : null,
        actScore: act ? parseInt(act) : null,
      }),
    });

    // Recategorise all items
    const updatedItems = items.map((item) => {
      const college = COLLEGES_SEED.find((c) => c.slug === item.college_slug);
      const newCategory = college
        ? categoriseCollege(
            {
              acceptanceRate: college.acceptance_rate
                ? college.acceptance_rate / 100
                : null,
              avgGpa: null,
              avgSat: null,
            },
            {
              gpa: gpa ? parseFloat(gpa) : null,
              sat: sat ? parseInt(sat) : null,
              act: act ? parseInt(act) : null,
            }
          )
        : ("unknown" as Category);

      if (newCategory !== item.category) {
        fetch("/api/list", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: item.id, category: newCategory }),
        });
      }
      return { ...item, category: newCategory };
    });
    setItems(updatedItems);
    setProfileSaving(false);
  }

  async function addCollege(slug: string) {
    setAdding(slug);
    const college = COLLEGES_SEED.find((c) => c.slug === slug);
    const category = college
      ? categoriseCollege(
          {
            acceptanceRate: college.acceptance_rate
              ? college.acceptance_rate / 100
              : null,
            avgGpa: null,
            avgSat: null,
          },
          studentProfile
        )
      : "unknown";

    const res = await fetch("/api/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeSlug: slug, category }),
    });

    if (res.ok) {
      await fetchList();
    }
    setSearchQuery("");
    setShowDropdown(false);
    setAdding(null);
  }

  async function removeItem(itemId: string) {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    await fetch(`/api/list?itemId=${itemId}`, { method: "DELETE" });
  }

  async function updateItem(
    itemId: string,
    updates: { category?: Category; applicationStatus?: string; notes?: string }
  ) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              ...(updates.category && { category: updates.category }),
              ...(updates.applicationStatus && {
                application_status: updates.applicationStatus,
              }),
              ...(updates.notes !== undefined && { notes: updates.notes }),
            }
          : i
      )
    );
    await fetch("/api/list", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, ...updates }),
    });
  }

  // Drag and drop
  function handleDragStart(e: DragEvent, itemId: string) {
    setDragId(itemId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e: DragEvent, targetCategory: Category) {
    e.preventDefault();
    if (dragId) {
      updateItem(dragId, { category: targetCategory });
      setDragId(null);
    }
  }

  // Grouping
  const reach = items.filter((i) => i.category === "reach");
  const target = items.filter((i) => i.category === "target");
  const safety = items.filter((i) => i.category === "safety");
  const unknown = items.filter((i) => i.category === "unknown");

  // Loading / not signed in
  if (loading || isSignedIn === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-28">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h1 className="font-display text-3xl font-bold text-navy mb-4">
            My College List
          </h1>
          <p className="font-body text-navy/60 mb-8">
            Sign up to build your personalised Reach, On Target, and Safety list.
            Track applications and compare your options — free.
          </p>
          <Link
            href="/auth/signup?next=/my-list"
            className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-all text-lg"
          >
            Create an account &rarr;
          </Link>
          <p className="font-body text-sm text-navy/40 mt-4">
            Already have an account?{" "}
            <Link
              href="/auth/signin?next=/my-list"
              className="text-gold hover:text-gold/80 underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-2">
            My College List
          </h1>
          <p className="font-body text-navy/60">
            Build your personalised Reach, On Target, and Safety list
          </p>
        </div>

        {/* Student profile bar */}
        <div className="ktc-card p-6 mb-8">
          <p className="font-body font-medium text-navy text-sm mb-4">
            Your academic profile
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="font-body text-xs text-navy/50 block mb-1">
                GPA
              </label>
              <input
                type="number"
                min="0"
                max="4"
                step="0.1"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="e.g. 3.7"
                className="w-24 px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
              />
            </div>
            <div>
              <label className="font-body text-xs text-navy/50 block mb-1">
                SAT <span className="text-navy/30">(optional)</span>
              </label>
              <input
                type="number"
                min="400"
                max="1600"
                value={sat}
                onChange={(e) => setSat(e.target.value)}
                placeholder="e.g. 1320"
                className="w-28 px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
              />
            </div>
            <div>
              <label className="font-body text-xs text-navy/50 block mb-1">
                ACT <span className="text-navy/30">(optional)</span>
              </label>
              <input
                type="number"
                min="1"
                max="36"
                value={act}
                onChange={(e) => setAct(e.target.value)}
                placeholder="e.g. 29"
                className="w-24 px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
              />
            </div>
            <button
              onClick={saveProfile}
              disabled={profileSaving}
              className="px-5 py-2 bg-gold hover:bg-gold/90 text-navy font-body text-sm font-medium rounded-md transition-all disabled:opacity-50"
            >
              {profileSaving ? "Saving..." : "Update my profile"}
            </button>
          </div>
        </div>

        {/* Add college */}
        <div className="mb-8">
          <div className="relative max-w-lg" ref={dropdownRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                if (searchQuery.length >= 2) setShowDropdown(true);
              }}
              placeholder="Search for a college to add..."
              className="w-full px-4 py-3 border border-gray-200 rounded-md font-body text-navy text-sm focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
            />
            {showDropdown && filteredColleges.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredColleges.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => addCollege(c.slug)}
                    disabled={adding === c.slug}
                    className="w-full text-left px-4 py-2.5 font-body text-sm text-navy hover:bg-cream transition-colors flex items-center justify-between disabled:opacity-50"
                  >
                    <span>
                      {c.name}
                      <span className="text-navy/40 ml-2 text-xs">
                        {c.location}
                      </span>
                    </span>
                    <span className="text-gold text-lg">+</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3-column layout */}
        {items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <CategoryColumn
                category="reach"
                label="Reach"
                color="crimson"
                items={reach}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onRemove={removeItem}
                onUpdate={updateItem}
              />
              <CategoryColumn
                category="target"
                label="Target"
                color="gold"
                items={target}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onRemove={removeItem}
                onUpdate={updateItem}
              />
              <CategoryColumn
                category="safety"
                label="Safety"
                color="sage"
                items={safety}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onRemove={removeItem}
                onUpdate={updateItem}
              />
            </div>

            {/* Unknown items */}
            {unknown.length > 0 && (
              <div className="mb-8">
                <p className="font-mono-label text-xs text-navy/40 uppercase tracking-wider mb-3">
                  Unrated — enter your GPA and scores above to categorise
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {unknown.map((item) => (
                    <CollegeCard
                      key={item.id}
                      item={item}
                      onDragStart={handleDragStart}
                      onRemove={removeItem}
                      onUpdate={updateItem}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Summary bar */}
            <div className="ktc-card p-6">
              <div className="flex flex-wrap items-center gap-6 mb-4">
                <p className="font-body text-navy">
                  <span className="font-bold">{items.length}</span> colleges
                </p>
                <div className="flex gap-4 text-sm font-body">
                  <span className="text-crimson font-medium">
                    Reach: {reach.length}
                  </span>
                  <span className="text-gold font-medium">
                    Target: {target.length}
                  </span>
                  <span className="text-sage font-medium">
                    Safety: {safety.length}
                  </span>
                </div>
              </div>
              {safety.length < 2 && (
                <p className="text-sm font-body text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-2">
                  Add at least 2 safety schools
                </p>
              )}
              {target.length < 3 && (
                <p className="text-sm font-body text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-2">
                  Add at least 3 target schools
                </p>
              )}
              {items.length > 12 && (
                <p className="text-sm font-body text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-2">
                  Most counsellors recommend 8–12 schools
                </p>
              )}
              <p className="text-xs font-body text-navy/40 mt-3">
                Category suggestions are based on published averages and are a
                guide only. Every application is individual. Drag cards between
                columns to override.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="font-body text-navy/50 text-lg mb-2">
              No colleges yet
            </p>
            <p className="font-body text-navy/40 text-sm">
              Search above to start building your list
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Category column ─── */

function CategoryColumn({
  category,
  label,
  color,
  items,
  onDragStart,
  onDragOver,
  onDrop,
  onRemove,
  onUpdate,
}: {
  category: Category;
  label: string;
  color: string;
  items: ListItem[];
  onDragStart: (e: DragEvent, id: string) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent, cat: Category) => void;
  onRemove: (id: string) => void;
  onUpdate: (
    id: string,
    updates: { category?: Category; applicationStatus?: string; notes?: string }
  ) => void;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, category)}
      className="min-h-[200px]"
    >
      <div
        className={`flex items-center gap-2 mb-4 pb-2 border-b-2 border-${color}`}
      >
        <span
          className={`w-3 h-3 rounded-full bg-${color}`}
        />
        <h2 className={`font-display text-lg font-bold text-${color}`}>
          {label}
        </h2>
        <span className="font-mono-label text-xs text-navy/40 ml-auto">
          {items.length}
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <CollegeCard
            key={item.id}
            item={item}
            onDragStart={onDragStart}
            onRemove={onRemove}
            onUpdate={onUpdate}
          />
        ))}
        {items.length === 0 && (
          <p className="text-xs font-body text-navy/30 text-center py-8">
            Drag colleges here
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── College card ─── */

function CollegeCard({
  item,
  onDragStart,
  onRemove,
  onUpdate,
}: {
  item: ListItem;
  onDragStart: (e: DragEvent, id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (
    id: string,
    updates: { category?: Category; applicationStatus?: string; notes?: string }
  ) => void;
}) {
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState(item.notes || "");
  const collegeName = item.colleges?.name || item.college_slug;
  const acceptanceRate = item.colleges?.acceptance_rate;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      className="ktc-card p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          href={`/college/${item.college_slug}`}
          className="font-body font-medium text-navy text-sm hover:text-gold transition-colors leading-tight"
        >
          {collegeName}
        </Link>
        <button
          onClick={() => onRemove(item.id)}
          className="text-navy/20 hover:text-crimson transition-colors text-lg flex-shrink-0 leading-none"
        >
          &times;
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-${
            item.category === "reach"
              ? "crimson"
              : item.category === "target"
              ? "gold"
              : item.category === "safety"
              ? "sage"
              : "gray-200"
          }/15 text-${
            item.category === "reach"
              ? "crimson"
              : item.category === "target"
              ? "gold"
              : item.category === "safety"
              ? "sage"
              : "navy/40"
          }`}
        >
          {getCategoryLabel(item.category)}
        </span>
        {acceptanceRate != null && (
          <span className="text-xs font-body text-navy/40">
            {acceptanceRate}% acceptance
          </span>
        )}
      </div>

      {/* Status dropdown */}
      <select
        value={item.application_status}
        onChange={(e) =>
          onUpdate(item.id, { applicationStatus: e.target.value })
        }
        className="w-full text-xs font-body text-navy/60 border border-gray-100 rounded px-2 py-1.5 focus:outline-none focus:border-gold/40 bg-white"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Notes toggle */}
      <button
        onClick={() => setShowNotes(!showNotes)}
        className="text-xs font-body text-navy/30 hover:text-navy/50 mt-2 transition-colors"
      >
        {showNotes ? "Hide notes" : "Add note"}
      </button>
      {showNotes && (
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onBlur={() => onUpdate(item.id, { notes: noteText })}
          rows={2}
          placeholder="Add a note..."
          className="w-full mt-1 text-xs font-body text-navy border border-gray-100 rounded px-2 py-1.5 focus:outline-none focus:border-gold/40 resize-none"
        />
      )}
    </div>
  );
}
