import React from "react";
import { Link } from "react-router";
import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";


const NoteCard = ({ note, setNotes }) => {
  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent default action
    e.stopPropagation();
  setNotes((prev) => prev.filter((n) => n._id !== note._id)); // get rid of the deleted one
    if(!window.confirm("Are you sure you want to delete this note?")) {
      return; // Exit if the user cancels the deletion
    }
    try {
      await api.delete(`/notes/${note._id}`);
      toast.success('Note deleted!');
      // Optionally, trigger a refresh or callback here
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note.');
    }
  };
  return (
    <Link
      to={`/note/${note._id}`}
      className="card bg-base-100 border-[#1082d9] hover:shadow-lg transition-all duration-200 border-t-4 border-solid"
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">{note.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{note.content}</p>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60"> {formatDate(new Date(note.createdAt))}</span>
          <div className="flex items-center gap-1">
            <PenSquareIcon className="size-4" />
            <button className="btn btn-ghost btn-xs text-error" onClick={handleDelete} title="Delete Note">
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
