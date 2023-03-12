import classes from '../styles/header.module.css'
function Header() {

  return (

    <nav className={`${classes.naver} flex`}>
      <div className={classes.name}>Innovators' Hub</div>
      <ul className={classes.uls } >
      <div className='flex'>
        <li className={classes.lis}>Home</li>
        <li className={classes.lis}>Contact us</li>
      </div>
      <div className='flex'>
        <li className={classes.lis}>Verify</li>
        <li className={classes.lis}>Get Started</li>
      </div>
      </ul>
    </nav> 

    // <div className={"flex flex-col md:flex-row " + `${classes.naver}`}>
    //   <div className={"flex-none " + `${classes.name}`}>
    //   Innovators' Hub
    //   </div>
    //   <div className="flex-1 w-100">
    //   </div>
    //   <div className="flex-1 w-32">
    //     <ul className='flex flex-wrap'>
    //       <li className={classes.lis}>Home</li>
    //       <li className={classes.lis}>Contact us</li>
    //       <li className={classes.lis}>Verify</li>
    //       <li className={classes.lis}>Get Started</li>
    //     </ul>
    //   </div>
    // </div>
  );
}

export default Header;
 