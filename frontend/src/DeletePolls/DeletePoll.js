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
            console.log(`Deleting poll with ID: ${pollId}`);  // Log Poll-ID
            const res = await fetch(`http://localhost:3001/api/polls/${pollId}`, {
                method: 'DELETE',
            });
    
            const data = res.headers.get('Content-Type')?.includes('application/json')
                ? await res.json()
                : null;
    
            console.log('Server response:', data);  // Log die Serverantwort
    
            if (res.ok) {
                alert(data?.message || 'Poll deleted successfully.');
                refreshPolls(); // Refresh the poll list
            } else {
                console.error('Delete failed:', data || res.statusText);
                alert(`${data?.error || res.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting poll:', error);
            alert('An error occurred while deleting the poll.');
        }
    };
    
    return (
        <button 
            onClick={handleDelete} 
            disabled={!pollId} 
            className='Delete_Button'
            title="Nur Polls löschen, welche noch nicht begonnen wurden"  // Tooltip-Nachricht hier
        >
            Delete Poll
        </button>
    );
};

export default DeletePoll;
