"use client";

import { useState, useEffect, useCallback } from "react";
import AppShell from "@/components/AppShell";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Task {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditingTask, setIsEditingTask] = useState<null | "new" | Task>(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/tasks");
    if (res.ok) setTasks(await res.json());
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleSave() {
    if (!content.trim()) return;
    setSaving(true);
    try {
      if (isEditingTask && isEditingTask !== "new") {
        const res = await fetch(`/api/tasks/${isEditingTask.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        if (!res.ok) throw new Error();
        toast.success("Note updated");
      } else {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        if (!res.ok) throw new Error();
        toast.success("Note saved");
      }
      setContent("");
      setIsEditingTask(null);
      fetchTasks();
    } catch {
      toast.error("Could not save note");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this note?")) return;
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    fetchTasks();
  }

  const openEdit = (t: Task) => {
    setIsEditingTask(t);
    setContent(t.content);
  };

  return (
    <AppShell>
      {isEditingTask !== null ? (
        // Inline Notes Editor screen (Dedicated note-taking page)
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--navy-border)", paddingBottom: 16, marginBottom: 8 }}>
            <button
              onClick={() => { setIsEditingTask(null); setContent(""); }}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--navy)", background: "none", border: "none", cursor: "pointer" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Notes
            </button>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--navy)" }}>
              {isEditingTask === "new" ? "New Note" : "Edit Note"}
            </h2>
          </div>

          <textarea
            className="form-input"
            rows={12}
            placeholder="Write down something here... (e.g. daily tasks, cylinder tallies, customer requests)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "var(--radius)",
              border: "1px solid var(--navy-border)",
              fontSize: "14px",
              lineHeight: "1.6",
              resize: "vertical",
              background: "var(--white)",
              color: "var(--text)"
            }}
          />

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            {isEditingTask !== "new" && (
              <button
                type="button"
                className="btn btn-danger"
                style={{ padding: "8px 16px", minWidth: 100 }}
                onClick={() => {
                  handleDelete(isEditingTask.id);
                  setIsEditingTask(null);
                  setContent("");
                }}
              >
                Delete
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: "8px 16px", minWidth: 100 }}
              onClick={() => {
                setIsEditingTask(null);
                setContent("");
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: "8px 24px", minWidth: 120 }}
              onClick={handleSave}
              disabled={saving || !content.trim()}
            >
              {saving ? "Saving..." : isEditingTask === "new" ? "Save Note" : "Update Note"}
            </button>
          </div>
        </div>
      ) : (
        // Standard Notes Grid View
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div className="page-title" style={{ margin: 0 }}>Notes Board</div>
            <button
              onClick={() => { setIsEditingTask("new"); setContent(""); }}
              className="btn btn-primary btn-sm"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Note
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state" style={{ background: "var(--white)", border: "1px solid var(--navy-border)", borderRadius: "var(--radius)", padding: "48px 24px" }}>
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-text" style={{ fontSize: 14 }}>No notes yet. Click "New Note" to write down something!</div>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className="task-card"
                  onClick={() => openEdit(t)}
                  style={{ cursor: "pointer" }}
                >
                  <div style={{ whiteSpace: "pre-wrap", fontSize: "14px", color: "var(--text)" }}>{t.content}</div>
                  <div className="task-card-date">
                    {format(new Date(t.updatedAt), "dd MMM yyyy, hh:mm a")}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Plus icon FAB also routes to full-page New Note view */}
          <button
            className="fab"
            onClick={() => { setIsEditingTask("new"); setContent(""); }}
            title="Add Note"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </>
      )}
    </AppShell>
  );
}