import { React ,Component } from "react";

class APIUtil extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null,
            isLoaded: false,
            items: [] }
    }
    render() { 
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
           console.log(items);
            return (
            <div>test</div>
          
            );
          }
      
    }
    componentDidMount()
    {
        fetch("http://localhost:57349/api/coredata")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result.items
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    }
}
 
export default APIUtil;