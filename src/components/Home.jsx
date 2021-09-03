import React from 'react';
import axios from 'axios';
import listReactFiles from 'list-react-files';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem ,Form ,FormControl,Button } from 'react-bootstrap';

class Home extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        xmlsList:[]
        };
    }

    componentDidMount(){
        this.importingXmls();
    }
  
 //Dynamic Importing of Xmls------------------------
 importingXmls(){
    function importAll(r) {
      return r.keys().map(r);
    }
    var images = importAll(require.context('./Xml', false, /\.(pagex)$/));
    console.log(images)
    this.setState({
      xmlsList:images},() => {
        console.log(this.state.xmlsList)
      })   
      
      return this.state.xmlsList
  }
  

    render() {
      return (
        <div class="container" style={{background:"#004C99" }}>
        <br/>
        <div >
            <center><h3 style={{color:'white'}}>Welcome To ECSCADA Design Studio</h3></center>
        </div>
        <br/>   
     
       
        <div class="container">
                 <div class="row">
                    
          {this.state.xmlsList.map((page)=>{
          var pageName = page.default.split("/")
          pageName = pageName[3].split(".")
          pageName = pageName[0]

          
          return   <div  class="col-md-3 text-center"  style={{
            paddingBottom: '30px',
          }}> 
          
        
       <a href="UNCCanvas"> <Button style={{width: "75%"}} onClick={()=> this.handleSubmit(pageName)} variant="btn btn-secondary btn-lg">
           {pageName}
            </Button></a>
            </div>
        })}
       </div></div></div>
      );
}
}


export default Home;
