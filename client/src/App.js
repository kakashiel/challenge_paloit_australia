import React, {Component} from 'react';
import axios from "axios";


class App extends Component {
    state = {
        data: [],
        id: 0,
        name: '',
        intervalIsSet: false,
        idToDelete: null,
        idToUpdate: null,
        objectToUpdate: null
    };

    componentDidMount() {
        this.getDataFromDb();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getDataFromDb, 1000);
            this.setState({intervalIsSet: interval});
        }
    }

    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({intervalIsSet: null});
        }
    }

    putDataToDB = name => {
        let currentIds = this.state.data.map(data => data.id);
        let idToBeAdded = 0;
        while (currentIds.includes(idToBeAdded)) {
            ++idToBeAdded;
        }
        console.log('name', name)
        axios.post("http://localhost:3001/api/putData", {
            id: idToBeAdded,
            name: name
        });
    };

    getDataFromDb = () => {
        fetch("http://localhost:3001/api/getData")
            .then(data => data.json())
            .then(res => this.setState({data: res.data}));
    };

    render() {
        const { data } = this.state;
        return (
            <div className="App">
                <ul>
                    {data.length <= 0
                        ? "NO DB ENTRIES YET"
                        : data.map(dat => (
                            <li style={{ padding: "10px" }} key={data.name}>
                                <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
                                <span style={{ color: "gray" }}> name: </span>
                                {dat.name}
                            </li>
                        ))}
                </ul>
                <div style={{ padding: "10px" }}>
                    <input type="text" value={this.state.name} onChange={e => this.setState({name: e.target.value})}/>
                    <button onClick={() => this.putDataToDB(this.state.name)} >add</button>
                </div>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </div>
        );
    }
}

export default App;
