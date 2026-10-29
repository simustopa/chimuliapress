
import BookForm from './BookForm';

export default function Edit({ auth, book, categories = [] }) {
    return <BookForm auth={auth} book={book} categories={categories} />;
}
