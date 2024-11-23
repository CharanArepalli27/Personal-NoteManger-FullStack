import "./index.css";
import { MdEditCalendar } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const NotesList = (props) => {
  const { noteDetails, onDeleteNote, onChangeEdit } = props;
  const { id, title, description, category, created_at, updated_at } =
    noteDetails;

  const onClickDelete = () => {
    onDeleteNote(id);
  };
  const onclickEdit = () => {
    onChangeEdit(noteDetails);
  };
  return (
    <li className="list-item">
      <h1>Title : {title}</h1>
      <p>Description : {description}</p>
      <p>Category : {category}</p>
      <p>Created At {created_at}</p>
      {updated_at !== null && <p>Updated At : {updated_at}</p>}
      <div className="buttons">
        <button className="button">
          <MdDelete size={25} onClick={onClickDelete} />
        </button>
        <button className="button">
          <MdEditCalendar size={25} onClick={onclickEdit} />
        </button>
      </div>
    </li>
  );
};
export default NotesList;
