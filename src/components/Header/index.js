import React from 'react';

export default function Header() {
    return (
        <header className="container-fluid d-flex justify-content-end" >
            <div className=" d-flex align-items-center">


                <div className="text-right mr-3" >
                    <span className="d-block m-0 p-0 text-white">Igreja Tal </span>
                    <small className="d-block m-0 p-0 text-white " >Gold</small>
                </div>

                <img src="https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png"

                />

                <span className="mdi mdi-chevron-down " />
            </div>
        </header>
    );
}