import Note from '../models/Note.js';

export async function getAllNotes(_, res) {
    try {
        const notes = await Note.find().sort({ createdAt: -1 }); //-1 sorts in descending order
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}   
export async function getNoteById(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);    
    } catch (error) {
        console.error("Error fetching note:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function createNote(req, res) {
    try {
        const { title, content } = req.body;
        const newNote = new Note({ title ,content });
        await newNote.save();
        res.status(201).json({message: "Note created successfully"});
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
} 
export async function updateNote(req, res) {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    if (!updatedNote) {
        return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note updated successfully" });
} 

export async function deleteNode(req, res) {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

} 
