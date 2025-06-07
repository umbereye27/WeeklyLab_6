import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { Review, ReviewInput } from '../type/types';

export const addReview = async (movieId: string, reviewData: ReviewInput): Promise<Review> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const newReview = {
      ...reviewData,
      movieId,
      createdAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(reviewsRef, newReview);
    
    return {
      id: docRef.id,
      ...newReview,
      createdAt: newReview.createdAt.toDate(),
    };
  } catch (error) {
    console.error('Error adding review:', error);
    throw new Error('Failed to add review');
  }
};

export const getReviews = async (movieId: string): Promise<Review[]> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('movieId', '==', movieId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        name: data.name,
        rating: data.rating,
        comment: data.comment,
        movieId: data.movieId,
        createdAt: data.createdAt.toDate(),
      });
    });
    
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Failed to fetch reviews');
  }
};