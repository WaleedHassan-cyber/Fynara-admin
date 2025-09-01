import React,{useState} from "react";

const SideBar = () => {
  const [openSide,setoOpenSide ] = useState(false);

  const toggleSidebar = () => {
    setoOpenSide(!openSide);
    const sidebar = document.querySelector('.sidebar');
    if (openSide) {
      sidebar.classList.remove('open');
    } else {
      sidebar.classList.add('open');
    }
  }
  return (
    <>
      <div className="sidebar" >
        <div className="logo-details" onClick={toggleSidebar}>
          <div className="logo_name">constGenius</div>
          <i className="bx bx-menu" id="btn" />
        </div>
        <ul className="nav-list">
          <li>
            <i className="bx bx-search" />
            <input type="text" placeholder="Search..." />
            <span className="tooltip">Search</span>
          </li>
          <li>
            <a href="#home-section">
              <i className="bx bx-grid-alt" />
              <span className="links_name">Dashboard</span>
            </a>
            <span className="tooltip">Dashboard</span>
          </li>
          <li>
            <a href="">
              <i className="bx bx-pie-chart-alt-2" />
              <span className="links_name">Analytics</span>
            </a>
            <span className="tooltip">Analytics</span>
          </li>
          <li>
            <a href="">
              <i className="bx bx-folder" />
              <span className="links_name">Files</span>
            </a>
            <span className="tooltip">Files</span>
          </li>
          <li>
            <a href="">
              <i className="bx bx-cart-alt" />
              <span className="links_name">Order</span>
            </a>
            <span className="tooltip">Order</span>
          </li>
          <li>
            <a href="">
              <i className="bx bx-heart" />
              <span className="links_name">Saved</span>
            </a>
            <span className="tooltip">Saved</span>
          </li>
          <li>
            <a href="#settings-section">
              <i className="bx bx-cog" />
              <span className="links_name">Settings</span>
            </a>
            <span className="tooltip">Settings</span>
          </li>
          <li className="profile">
            <div className="profile-details">
              <img src="./images/profile.png" alt="profileImg" />
              <div className="name_job">
                <div className="name">const Genius</div>
                <div className="job">Web Developer</div>
              </div>
            </div>
            <i className="bx bx-log-out" id="log_out" />
          </li>
        </ul>
      </div>
      <section className="home-section" id="home-section">
        <div className="text">Dhaaaaaaaaaaaaaaaaaaaaaad</div>
      </section>
      <section className="setting-section" id="settings-section">
        <div className="text">Settinsssssssssssssssssssssgs</div>
        <div className="text">hell</div>
      </section>
    </>
  );
};

export default SideBar;
