import { useState, useEffect } from "react";
import NotesList from "../NotesList";
import "./index.css";

const NoteForm = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [addTitle, setAddTitle] = useState("");
  const [addCategory, setAddCategory] = useState("WORK");
  const [addDescription, setAddDescription] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  //!To get All Notes
  const getNotes = async () => {
    try {
      const response = await fetch(
        `https://persnolnotesmanager-backend.onrender.com/notes`
      );

      if (response.ok) {
        const data = await response.json();
        setNotes(data);
        setError("");
      }
    } catch (error) {
      setError("An error occurred while fetching notes");
      setNotes([]);
    }
  };

  //!To add new Note
  const onSubmitAddForm = async (event) => {
    event.preventDefault();
    if (!addTitle.trim() || !addDescription.trim() || !addCategory.trim()) {
      alert("All fields are required");
      return;
    }

    const noteDetails = {
      title: addTitle,
      description: addDescription,
      category: addCategory,
    };
    try {
      const response = await fetch(
        `https://persnolnotesmanager-backend.onrender.com/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteDetails),
        }
      );
      if (response.ok) {
        setAddTitle("");
        setAddCategory("WORK");
        setAddDescription("");
        getNotes();
      } else {
        setError("Unable to add the note. Please try again.");
      }
    } catch (error) {
      setError("Error occurred while adding note details.");
    }
  };

  //!To add Specific Category
  const onSubmitCategory = async (event) => {
    event.preventDefault();

    if (!searchCategory) {
      alert("Please select a category to search");
      return;
    }

    try {
      const response = await fetch(
        `https://persnolnotesmanager-backend.onrender.com/notes/${searchCategory}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          setError("No notes found for the selected category.");
        } else {
          setNotes(data);
          setError("");
        }
      } else {
        const errorData = await response.json();
        setError(
          errorData.error || "Unable to fetch notes for the selected category."
        );
        setNotes([]);
      }
    } catch (error) {
      setError("An error occurred while fetching notes.");
      setNotes([]);
    }
  };

  //!To delete a Note
  const onDeleteNote = async (id) => {
    try {
      const response = await fetch(
        `https://persnolnotesmanager-backend.onrender.com/notes/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        getNotes();
      }
    } catch (error) {
      setError(error);
    }
  };
  //!To edit the note
  const onEditNote = async (event) => {
    event.preventDefault()
    const noteDetails = {
      title: addTitle,
      description: addDescription,
      category: addCategory,
    };
    try {
      const response = await fetch(
        `http://localhost:3000/notes/${editingNoteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteDetails),
        }
      );
      if (response.json()) {
        setAddTitle("");
        setAddCategory("WORK");
        setAddDescription("");
        setEditingNoteId(null);
        getNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeEdit = (data) => {
    setEditingNoteId(data.id);
    setAddCategory(data.category);
    setAddDescription(data.description);
    setAddTitle(data.title);
  };

  const onChangeAddTitle = (event) => {
    setAddTitle(event.target.value);
  };
  const onChangeAddDescription = (event) => {
    setAddDescription(event.target.value);
  };
  const onChangeAddCategory = (event) => {
    setAddCategory(event.target.value);
  };
  const onChangeSearchCategory = (event) => {
    setSearchCategory(event.target.value);
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <div className="main-container">
      <h1 className="heading">Personal Notes Manager</h1>
      <div className="Forms-container">
        <form
          className="AddNewNote-Form"
          onSubmit={editingNoteId ? onEditNote : onSubmitAddForm}
        >
          <h3 className="form-heading">Add Your Note</h3>
          <div className="input-element">
            <label className="label" htmlFor="add-title">
              Title
            </label>
            <input
              type="text"
              className="input"
              id="add-title"
              placeholder="Title"
              value={addTitle}
              onChange={onChangeAddTitle}
            />
          </div>
          <div className="input-element">
            <label className="label" htmlFor="add-category">
              Category
            </label>
            <select
              className="input"
              id="add-category"
              value={addCategory}
              onChange={onChangeAddCategory}
            >
              <option value="WORK">WORK</option>
              <option value="PERSONAL">PERSONAL</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
          <div className="input-element">
            <label className="label" htmlFor="add-Description">
              Description
            </label>
            <textarea
              className="input text-area"
              id="add-Description"
              placeholder="Description"
              value={addDescription}
              onChange={onChangeAddDescription}
            />
          </div>
          <button className="submit-button" type="submit">
            {editingNoteId ? "Update" : "Submit"}
          </button>
        </form>

        <form
          className="SearchByCategory-Title-Form"
          onSubmit={onSubmitCategory}
        >
          <h3 className="form-heading">Search Notes by Category</h3>
          <div className="input-element">
            <label className="label" htmlFor="add-category">
              Category
            </label>
            <select
              className="input"
              id="add-category"
              value={searchCategory}
              onChange={onChangeSearchCategory}
            >
              <option value="WORK">WORK</option>
              <option value="PERSONAL">PERSONAL</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
          <button className="submit-button" type="submit">
            Submit
          </button>
        </form>
      </div>
      <ul className="notes-list">
        {notes.length > 0 ? (
          notes.map((eachNote) => (
            <NotesList
              noteDetails={eachNote}
              key={eachNote.id}
              onDeleteNote={onDeleteNote}
              onChangeEdit={onChangeEdit}
            />
          ))
        ) : (
          <p className="Error-message">{error}</p>
        )}
      </ul>
    </div>
  );
};

export default NoteForm;
