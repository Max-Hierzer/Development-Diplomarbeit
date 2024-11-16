import React from 'react';

const DeletePoll = ({ pollId, refreshPolls }) => {
    const handleDelete = async () => {
        if (!pollId) {
            alert('Please select a poll to delete.');
            return;
        }

        const confirmDelete = window.confirm('Are you sure you want to delete this poll? This action cannot be undone.');
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:3001/api/poll/${pollId}`, {
                method: 'DELETE',
            });

            const data = res.headers.get('Content-Type')?.includes('application/json')
                ? await res.json()
                : null;

            if (res.ok) {
                alert(data?.message || 'Poll deleted successfully.');
                refreshPolls(); // Refresh the poll list
            } else {
                console.error('Delete failed:', data || res.statusText);
                alert(`Error: ${data?.error || res.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting poll:', error);
            alert('An error occurred while deleting the poll.');
        }
    };

    return (
        <button onClick={handleDelete} disabled={!pollId}>
            Delete Poll
        </button>
    );
};

export default DeletePoll;
