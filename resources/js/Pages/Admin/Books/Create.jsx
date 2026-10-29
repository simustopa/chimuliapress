
import BookForm from './BookForm';

export default function Create({ auth, categories = [] }) {
    return <BookForm auth={auth} categories={categories} />;
}
