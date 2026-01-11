import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewComment.css';

function AddComment() {
    const navigate = useNavigate();

    // Stav pro hodnotu hodnocení (defaultně 5)
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Odesílám hodnocení:", { rating, comment });
        alert(`Děkujeme! Odesláno: ${rating}*`);
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
                                    />
                                    <span className="rating-value" id="ratingValue">
                                        {rating}*
                                    </span>
                                </div>

                                <div className="btn-group">
                                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                                        Zpět
                                    </button>

                                    <button type="submit" className="btn btn-primary">
                                        Potvrdit
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