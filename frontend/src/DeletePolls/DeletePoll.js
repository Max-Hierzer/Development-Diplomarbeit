import React from 'react';

const DeletePoll = ({ selectedPoll, refreshPolls, setSelectedPoll, totalVotes }) => {
    const handleDelete = async () => {
        if (!selectedPoll.id) {
            alert('Please select a poll to delete.');
            return;
        }
    
        const confirmDelete = window.confirm('Are you sure you want to delete this poll? This action cannot be undone.');
        if (!confirmDelete) return;
    
        try {
            console.log(`Deleting poll with ID: ${selectedPoll.id}`);  // Log Poll-ID
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/polls/${selectedPoll.id}`, {
                method: 'DELETE',
            });
    
            const data = res.headers.get('Content-Type')?.includes('application/json')
                ? await res.json()
                : null;
    
            console.log('Server response:', data);  // Log die Serverantwort
    
            if (res.ok) {
                alert(data?.message || 'Poll deleted successfully.');
                refreshPolls(); // Refresh the poll list
                setSelectedPoll(null);
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
    <div>
    {totalVotes === 0 ? (
        <button
            onClick={handleDelete}
            disabled={!selectedPoll}
            className={'delete-button'}
        >
            Umfrage löschen
        </button>
    ) : (
        <button
            className={'disabled-button'}
            title={'Nur Polls löschen, welche noch nicht begonnen wurden'}  // Tooltip-Nachricht hier
        >
            Umfrage löschen
        </button>
    )}
    </div>
    );
};

export default DeletePoll;
