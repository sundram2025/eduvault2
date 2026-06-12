// lib/db.js
import {
  collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc,
  deleteDoc, query, where, orderBy, serverTimestamp, increment
} from 'firebase/firestore';
import { db } from './firebase';

// ─── COURSES ────────────────────────────────────────────────
export const getCourses = async () => {
  const snap = await getDocs(query(collection(db, 'courses'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getCourse = async (id) => {
  const snap = await getDoc(doc(db, 'courses', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const addCourse = async (data) => {
  return await addDoc(collection(db, 'courses'), {
    ...data,
    isFree: true,
    enrollments: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateCourse = async (id, data) => {
  await updateDoc(doc(db, 'courses', id), {
    ...data,
    isFree: true,
    updatedAt: serverTimestamp(),
  });
};

export const deleteCourse = async (id) => {
  await deleteDoc(doc(db, 'courses', id));
};

// ─── USERS ──────────────────────────────────────────────────
export const getUsers = async () => {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getUser = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateUser = async (uid, data) => {
  await updateDoc(doc(db, 'users', uid), data);
};

export const blockUser = async (uid, isBlocked) => {
  await updateDoc(doc(db, 'users', uid), { isBlocked });
};

// ─── ENROLLMENTS ─────────────────────────────────────────────
// Free instant enrollment — no payment, no approval needed
export const enrollUserInCourse = async (uid, courseId) => {
  await setDoc(doc(db, 'enrollments', `${uid}_${courseId}`), {
    uid,
    courseId,
    enrolledAt: serverTimestamp(),
    isActive: true,
    watchProgress: {},
  });
  await updateDoc(doc(db, 'courses', courseId), {
    enrollments: increment(1),
  });
};

export const getEnrollment = async (uid, courseId) => {
  const snap = await getDoc(doc(db, 'enrollments', `${uid}_${courseId}`));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getUserEnrollments = async (uid) => {
  const snap = await getDocs(
    query(collection(db, 'enrollments'), where('uid', '==', uid))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ─── ANALYTICS ──────────────────────────────────────────────
export const getAnalytics = async () => {
  const [users, courses, enrollments] = await Promise.all([
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'courses')),
    getDocs(collection(db, 'enrollments')),
  ]);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const activeUsers = users.docs.filter(d => {
    const lastActive = d.data().lastActive?.toDate?.();
    return lastActive && lastActive > yesterday;
  }).length;

  return {
    totalUsers: users.size,
    activeUsers,
    totalCourses: courses.size,
    totalEnrollments: enrollments.size,
  };
};

// ─── WATCH PROGRESS ─────────────────────────────────────────
export const updateWatchProgress = async (uid, courseId, lectureId, progress) => {
  const enrollmentRef = doc(db, 'enrollments', `${uid}_${courseId}`);
  await updateDoc(enrollmentRef, {
    [`watchProgress.${lectureId}`]: progress,
    lastWatched: serverTimestamp(),
  });
};
