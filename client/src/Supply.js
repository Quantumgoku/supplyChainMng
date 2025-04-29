import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import contractJson from "./contracts/SupplyChain.json";
import contractAddress from "./contracts/SupplyChain-address.json";
import './Supply.css';

function Supply() {
    const history = useHistory();
    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [contract, setContract] = useState();
    const [MED, setMED] = useState({});
    const [MedStage, setMedStage] = useState([]);
    const [ID, setID] = useState("");

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
            alert("Non-Ethereum browser detected. Consider installing MetaMask.");
        }
    };

    const loadBlockchaindata = async () => {
        try {
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            setCurrentaccount(account);

            const supplyChainContract = new web3.eth.Contract(contractJson.abi, contractAddress.address);
            setContract(supplyChainContract);

            const medCtr = await supplyChainContract.methods.medicineCtr().call();
            const med = {};
            const medStage = [];

            for (let i = 0; i < medCtr; i++) {
                med[i] = await supplyChainContract.methods.MedicineStock(i + 1).call();
                medStage[i] = await supplyChainContract.methods.showStage(i + 1).call();
            }

            setMED(med);
            setMedStage(medStage);
            setloader(false);
        } catch (err) {
            console.error("Blockchain data load error:", err);
            alert("The smart contract is not deployed to the current network or data could not be loaded.");
        }
    };

    const redirect_to_home = () => {
        history.push('/');
    };

    const handlerChangeID = (event) => {
        setID(event.target.value);
    };

    const handleTransaction = async (methodName, label) => {
        try {
            const receipt = await contract.methods[methodName](ID).send({ from: currentaccount });
            console.log(`${label} Receipt:`, receipt);
            if (receipt.events) {
                console.log(`${label} Event:`, receipt.events);
                loadBlockchaindata();
            }
        } catch (err) {
            console.error(`${label} Error:`, err);
            alert(`An error occurred during ${label.toLowerCase()}!`);
        }
    };

    if (loader) {
        return (
            <div className="loader-container">
                <h1 className="wait">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="supply-container">
            <div className="header-container">
                <span><b>Current Account Address:</b> {currentaccount}</span>
                <span onClick={redirect_to_home} className="btn btn-outline-danger btn-sm home-button">HOME</span>
            </div>
            <h6><b>Supply Chain Flow:</b></h6>
            <p>Medicine Order -&gt; Raw Material Supplier -&gt; Manufacturer -&gt; Distributor -&gt; Retailer -&gt; Consumer</p>

            <table className="table table-sm table-dark">
                <thead>
                    <tr>
                        <th scope="col">Medicine ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Current Processing Stage</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(MED).map(key => (
                        <tr key={key}>
                            <td>{MED[key].id}</td>
                            <td>{MED[key].name}</td>
                            <td>{MED[key].description}</td>
                            <td>{MedStage[key]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Action Steps */}
            {[
                { step: "Supply Raw Materials", method: "RMSsupply" },
                { step: "Manufacture", method: "Manufacturing" },
                { step: "Distribute", method: "Distribute" },
                { step: "Retail", method: "Retail" },
                { step: "Sold", method: "sold" },
            ].map(({ step, method }) => (
                <div className="supply-step" key={method}>
                    <h5><b>{step}</b></h5>
                    <form onSubmit={(e) => { e.preventDefault(); handleTransaction(method, step); }}>
                        <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                        <button className="btn btn-outline-success btn-sm">{step}</button>
                    </form>
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default Supply;
