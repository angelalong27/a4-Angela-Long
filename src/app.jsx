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
                className="btn btn-secondary btn-sm ms-2"
                onClick={() => props.deleteBook(props.book._id)}
                >
                Delete
                </button>
            </td>
        </tr>
    )
    
    const App = () => {
        const [books, setBooks] = useState([])
        const [editId, setEditId] = useState(null)
        
        useEffect(() => {
            const userId = localStorage.getItem('userId')
            fetch(`/data?userId=${userId}`)
            .then(response => response.json())
            .then(data => setBooks(data))
        }, [])
        
    const editBook = book => {
        setEditId(book._id)

        document.querySelector('#book').value = book.book || ''
        document.querySelector('#author').value = book.author || ''
        document.querySelector('#pagesRead').value = book.pagesRead || ''
        document.querySelector('#totalPages').value = book.totalPages || ''
        document.querySelector('#status').value = book.status || 'tbr'
        
        const format = document.querySelector(`input[name="format"][value="${book.format}"]`)
        if (format) {
            format.checked = true
        }     

        const rating = document.querySelector(`input[name="rating"][value="${book.rating}"]`)
        if (rating) {
            rating.checked = true
        }

        document.querySelector('#notes').value = book.notes || ''
        document.querySelectorAll('input[name="genre"]').forEach(checkbox => {
            checkbox.checked = book.genre
                ? book.genre.includes(checkbox.value)
                : false
        })
    }

    const submit = event => {
        event.preventDefault()
        const userId = localStorage.getItem('userId')
    
        const genres = Array.from(
            document.querySelectorAll('input[name="genre"]:checked')
        ).map(checkbox => checkbox.value)
    
        const json = {
            book: document.querySelector('#book').value,
            author: document.querySelector('#author').value,
            pagesRead: document.querySelector('#pagesRead').value,
            totalPages: document.querySelector('#totalPages').value,
            status: document.querySelector('#status').value,
            format: document.querySelector('input[name="format"]:checked')?.value || '',
            genre: genres,
            rating: document.querySelector('input[name="rating"]:checked')?.value || '',
            notes: document.querySelector('#notes').value,
            userId: userId,
            _id: editId
        }
    
        const route = editId === null ? '/submit' : '/update'
    
        fetch(route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
        .then(response => response.json())
        .then(() => {
            setEditId(null)
            document.querySelector('form').reset()

            const successMessage = document.querySelector('#successMessage')
            successMessage.classList.remove('d-none')
            
            setTimeout(() => {
                successMessage.classList.add('d-none')
            }, 2000)

            fetch(`/data?userId=${userId}`)
            .then(response => response.json())
            .then(data => setBooks(data))
        })
    }
    
    useEffect(() => {
        const form = document.querySelector('form')
        form.addEventListener('submit', submit)
        return () => {
            form.removeEventListener('submit', submit)
        }
    }, [editId])

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
    <Book key={book._id} book={book} editBook={editBook} deleteBook={deleteBook}/>
    ))}
    </>
    )
}
export default App