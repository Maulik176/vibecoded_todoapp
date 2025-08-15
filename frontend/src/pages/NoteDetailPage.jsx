import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchNote = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
        setTitle(res.data.title || "");
        setContent(res.data.content || "");
        setIsRateLimited(false);
      } catch (error) {
        const status = error?.response?.status;
        if (status === 429) {
          setIsRateLimited(true);
        } else if (status === 404) {
          toast.error("Note not found");
          navigate("/");
        } else {
          toast.error("Failed to load note");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!note) return;
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      setLoading(true);
      await api.delete(`/notes/${note._id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      const status = error?.response?.status;
      if (status === 429) {
        toast.error("Rate limit exceeded. Try again later.");
      } else {
        toast.error("Failed to delete note");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/notes/${id}`, { title, content });
      toast.success("Changes saved");
      navigate("/");
    } catch (error) {
      const status = error?.response?.status;
      if (status === 429) {
        toast.error("Rate limit exceeded. Try again later.");
      } else {
        toast.error("Failed to save changes");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to={"/"} className="btn btn-ghost">
              <ArrowLeftIcon className="size-5" />
              Back to Notes
            </Link>

            <button type="button" onClick={handleDelete} className="btn btn-outline btn-error" disabled={loading}>
              <Trash2Icon className="size-4" />
              <span className="ml-2">Delete Note</span>
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body relative">
              {loading && <div className="text-center text-primary py-10">Loading note...</div>}

              {!loading && !note && (
                <div className="text-center py-10">
                  <p className="text-lg">Note not found.</p>
                  <Link to="/" className="btn btn-primary mt-4">
                    Go back
                  </Link>
                </div>
              )}

              {note && (
                <form onSubmit={handleSave} className="space-y-6">

                  <div>
                    <label className="label">
                      <span className="label-text">Title</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Note Title"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Content</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full h-48"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your note here..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;