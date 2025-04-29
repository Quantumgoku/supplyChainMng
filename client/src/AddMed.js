import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./contracts/SupplyChain.json";
import SupplyChainAddress from "./contracts/SupplyChain-address.json";

function AddMed() {
    const history = useHistory();

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState({});
    const [MedName, setMedName] = useState("");
    const [MedDes, setMedDes] = useState("");
    const [MedStage, setMedStage] = useState([]);

    useEffect(() => {
        loadWeb3().then(loadBlockchaindata);
    }, []);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
        }
    };

    const loadBlockchaindata = async () => {
        try {
            setloader(true);
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts();
            setCurrentaccount(accounts[0]);

            const supplychain = new web3.eth.Contract(SupplyChainABI.abi, SupplyChainAddress.address);
            setSupplyChain(supplychain);

            const medCtr = await supplychain.methods.medicineCtr().call();
            const med = {};
            const medStage = [];

            for (let i = 0; i < medCtr; i++) {
                med[i] = await supplychain.methods.MedicineStock(i + 1).call();
                medStage[i] = await supplychain.methods.showStage(i + 1).call();
            }

            setMED(med);
            setMedStage(medStage);
            setloader(false);
        } catch (error) {
            console.error("Error loading contract or data:", error);
            alert("Smart contract not deployed to the current network or connection failed.");
        }
    };

    const redirect_to_home = () => history.push('/');

    const handlerChangeNameMED = (event) => setMedName(event.target.value);
    const handlerChangeDesMED = (event) => setMedDes(event.target.value);

    const handlerSubmitMED = async (event) => {
        event.preventDefault();
        try {
            const receipt = await SupplyChain.methods.addMedicine(MedName, MedDes).send({ from: currentaccount });
            if (receipt) {
                loadBlockchaindata(); // Refresh after success
            }
        } catch (err) {
            console.error("Error submitting medicine:", err);
            alert("An error occurred:\n" + (err?.message || "Unknown error"));
        }
    };

    if (loader) {
        return (
            <div style={styles.container}>
                <h1 className="wait">Loading...</h1>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.header}>
                    <span><b>Current Account Address:</b> {currentaccount}</span>
                    <span onClick={redirect_to_home} className="btn btn-outline-danger btn-sm" style={styles.homeButton}>HOME</span>
                </div>
                <br />
                <h5>Add Medicine Order:</h5>
                <form onSubmit={handlerSubmitMED} style={styles.form}>
                    <input className="form-control-sm" type="text" onChange={handlerChangeNameMED} placeholder="Medicine Name" required />
                    <input className="form-control-sm" type="text" onChange={handlerChangeDesMED} placeholder="Medicine Description" required />
                    <button className="btn btn-outline-success btn-sm" style={styles.submitButton}>Order</button>
                </form>
                <br />
                <h5>Ordered Medicines:</h5>
                <table className="table table-bordered" style={styles.table}>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Current Stage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(MED).map((key) => (
                            <tr key={key}>
                                <td>{MED[key].id}</td>
                                <td>{MED[key].name}</td>
                                <td>{MED[key].description}</td>
                                <td>{MedStage[key]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f0f4c3 30%, #c5e1a5 90%)',
        padding: '20px'
    },
    content: {
        backgroundColor: '#ffffffcc',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
        maxWidth: '700px',
        width: '100%',
        textAlign: 'center'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    homeButton: {
        marginLeft: 'auto',
        cursor: 'pointer'
    },
    form: {
        marginBottom: '20px'
    },
    submitButton: {
        marginTop: '10px'
    },
    table: {
        marginTop: '20px'
    }
};

export default AddMed;
