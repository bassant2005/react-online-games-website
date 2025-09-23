import Nav from "./Nav"
import Games from "./Games"
import Footer from "./Footer"
import "./styles.css";
import Iridescence from './Iridescence';
import React from "react";

function Home() {
  return(
   <>
    <Nav/>

      <Iridescence color={[0.2, 0.7, .7]} speed={1.2} amplitude={0.15}>
        <div className="main">
          <div className="intro d-flex justify-content-center align-items-center">
            <div className="intro-s text-center">
              <h2 className="fw-bold">Welcome to the Realm of Legends</h2>
              <p className="fs-5 fst-italic pb-2">
                Discover untold stories, epic battles, and worlds beyond imagination.
              </p>
              <a className="btn main-btn" href="#games">
                Begin Your Journey
              </a>
            </div>
          </div>
        </div>
      </Iridescence>
            
      <Games />
      <Footer/>
    </>
  )
}

export default Home
