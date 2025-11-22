import React, { createContext, useState, useEffect } from 'react';
import { dummyCourses } from '../assets/assets';
import humanizeDuration from 'humanize-duration';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Function to calculate average rating
  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }
    const totalRating = course.courseRatings.reduce((acc, r) => acc + r.rating, 0);
    return totalRating / course.courseRatings.length;
  };

  // Function to calculate chapter time
  const calculateChapterTime = (chapter) => {
    if (!chapter.chapterContent) return "0m";
    let time = 0;
    chapter.chapterContent.forEach((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to calculate course duration
  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        chapter.chapterContent.forEach((lecture) => (time += lecture.lectureDuration));
      }
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to calculate no of lectures
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };
  // Fetch user Enrolled Courses
  const fetchUserEnrolledCourses=async()=>{
    setEnrolledCourses(dummyCourses)
  }

  useEffect(() => {
    setAllCourses(dummyCourses);
    fetchUserEnrolledCourses()
  }, []);

  const value = {
    currency,
    allCourses,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,enrolledCourses,fetchUserEnrolledCourses
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
