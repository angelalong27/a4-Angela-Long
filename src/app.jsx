import React, { useState, useEffect } from 'react';

const Book = props => (
    <tr>
        <td>{props.book.book}</td>
        <td>{props.book.author}</td>
        <td>{props.book.pagesRead}</td>
        <td>{props.book.totalPages}</td>
        <td>{props.book.percentComplete}%</td>
        <td>{props.book.status}</td>
        <td>{props.book.format}</td>
        <td>{props.book.genre ? props.book.genre.join(', ') : ''}</td>
        <td>{props.book.rating}</td>
        <td>{props.book.notes}</td>
        <td>
            <button
            className="btn btn-primary btn-sm"
            onClick={() => props.editBook(props.book)}
            >
                Edit
                </button>
                
                <button
                className="btn btn-secondary btn-sm"
                onClick={() => props.deleteBook(props.book._id)}
                >
                Delete
                </button>
            </td>
        </tr>
    )

const App = () => {
    const [books, setBooks] = useState([])

    useEffect(() => {
        const userId = localStorage.getItem('userId')
        fetch(`/data?userId=${userId}`)
            .then(response => response.json())
            .then(data => setBooks(data))

    }, [])

    const deleteBook = (id) => {
        const userId = localStorage.getItem('userId')

        const json = {
            _id: id,
            userId: userId
        }

        fetch('/delete', {   
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(json)
            })
            .then(response => response.json())
            .then(() => {
                setBooks(books.filter(book => book._id !== id))
            })
    }
        
    return (
        <>
            {books.map(book => (
                <Book key={book._id} book={book} deleteBook={deleteBook} />
            ))}
        </>
    )
}

export default App