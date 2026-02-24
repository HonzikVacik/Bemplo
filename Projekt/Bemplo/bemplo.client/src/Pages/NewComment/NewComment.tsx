import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './NewComment.css';

function AddComment() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Stav pro načítání

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) {
            alert("Chyba: Není specifikována zkušenost (ExperienceId).");
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
                alert(`Chyba při odesílání: ${errorText}`);
            }

        } catch (error) {
            console.error("Chyba sítě:", error);
            alert("Nepodařilo se spojit se serverem.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="newComment-page">

                <div className="background-animation"></div>

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