import { onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { AiOutlineClose } from "react-icons/ai";
const SavedShows = () => {
  const { user } = UserAuth();
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    onSnapshot(doc(db, "users", `${user.email}`), (doc) => {
      setMovies(doc.data()?.savedShows);
    });
  }, [user?.email]);

  const slideLeft = () => {
    let slider = document.querySelector("#slider-");
    slider.scrollLeft = slider.scrollLeft - 500;
  };

  const slideRight = () => {
    let slider = document.querySelector("#slider-");
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  const movieRef = doc(db, "users", `${user?.email}`);

  const deleteShow = async (passedId) => {
    try {
      let newMovies = movies.filter((mov) => mov.id !== passedId);
      await updateDoc(movieRef, {
        savedShows: newMovies,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2 className="text-white font-bold md:text-xl p-4">My Shows</h2>
      <div className="relative flex items-center group">
        <MdChevronLeft
          className="bg-white rounded-full absolute opacity-50 hover:opacity-100 z-10 hidden group-hover:block"
          size={40}
          onClick={slideLeft}
        />
        <div
          id={`slider-`} // we pass in an ID so that react can understand on which row click event happens
          className="w-full h-full left-0 overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative"
        >
          {movies.map((item, id) => {
            return (
              <div
                key={id}
                className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block relative p-2"
              >
                <img
                  className="w-full h-auto block"
                  src={`https://image.tmdb.org/t/p/w500/${item?.img}`}
                  alt={item?.title}
                />
                <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white">
                  <p className="white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center">
                    {item?.title}
                  </p>
                  <p
                    className="absolute text-gray-300 top-4 right-4"
                    onClick={() => deleteShow(item.id)}
                  >
                    <AiOutlineClose />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <MdChevronRight
          className="bg-white right-0 rounded-full absolute opacity-50 hover:opacity-100 z-10 hidden group-hover:block "
          size={40}
          onClick={slideRight}
        />
      </div>
    </>
  );
};

export default SavedShows;
