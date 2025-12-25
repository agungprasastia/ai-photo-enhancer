export default function ProcessingStatus({ status }) {
    const statusMessages = {
        uploading: 'Uploading image...',
        processing: 'AI is working its magic...',
        complete: 'Enhancement complete!',
        error: 'Something went wrong'
    };

    return (
        <div className="processing-card">
            <div className="spinner" />
            <p style={{ fontSize: '1rem', fontWeight: 500, color: '#e2e8f0' }}>
                {statusMessages[status] || 'Processing...'}
            </p>
        </div>
    );
}
