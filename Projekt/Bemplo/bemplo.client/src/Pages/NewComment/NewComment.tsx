import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import './NewComment.css';

interface NotificationState {
    title: string;
    message: string;
    type?: 'success' | 'error';
}

function AddComment() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Stav pro načítání

    const [notification, setNotification] = useState<NotificationState | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) {
            setNotification({
                title: 'Chyba',
                message: "Chyba: Není specifikována zkušenost (ExperienceId).",
                type: 'error'
            });
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('jwtToken');

        try {
            const response = await fetch('/api/Comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    experienceId: parseInt(id),
                    comment: comment,
                    starCount: rating
                })
            });

            if (response.ok) {
                navigate(-1);
            } else {
                const errorText = await response.text();
                setNotification({
                    title: 'Chyba',
                    message: errorText,
                    type: 'error'
                });
            }

        } catch (error) {
            console.error("Chyba sítě:", error);
            setNotification({
                title: 'Chyba',
                message: "Nepodařilo se spojit se serverem.",
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setNotification(null);
    };

    const modalContent = notification ? (
        <div className="login-page">
            <div className="modal-overlay" onClick={() => setNotification(null)}>
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                    <h2>{notification.title}</h2>
                    <p>{notification.message}</p>
                    <button
                        className="modal-close-btn"
                        onClick={handleCloseModal}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    return (
        <>
            <div className="newComment-page">

                <div className="background-animation"></div>

                {ReactDOM.createPortal(
                    modalContent,
                    document.getElementById('modal-root')!
                )}

                <div className="wrapper">
                    <div className="glass-container">

                        <h2>Nové hodnocení</h2>

                        <form className="comment-form" onSubmit={handleSubmit}>

                            <div className="input-group">
                                <textarea
                                    id="comment"
                                    name="comment"
                                    placeholder=" "
                                    required
                                    rows={6}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    disabled={isSubmitting}
                                ></textarea>
                                <label htmlFor="comment">Text hodnocení</label>
                                <span className="focus-border"></span>
                            </div>

                            <div className="form-footer">

                                <div className="slider-group">
                                    <input
                                        type="range"
                                        id="rating"
                                        name="rating"
                                        min="1"
                                        max="5"
                                        value={rating}
                                        className="custom-range"
                                        onChange={(e) => setRating(Number(e.target.value))}
                                        disabled={isSubmitting}
                                    />
                                    <span className="rating-value" id="ratingValue">
                                        {rating}*
                                    </span>
                                </div>

                                <div className="btn-group">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate(-1)}
                                        disabled={isSubmitting}
                                    >
                                        Zpět
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Odesílám...' : 'Potvrdit'}
                                    </button>
                                </div>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </>
    );
}

export default AddComment;