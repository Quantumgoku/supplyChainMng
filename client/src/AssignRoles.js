import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import SupplyChainABI from "./contracts/SupplyChain.json";
import SupplyChainAddress from "./contracts/SupplyChain-address.json";
import { useHistory } from "react-router-dom";
import './AssignRoles.css';

function AssignRoles() {
    const history = useHistory();

    const [currentAccount, setCurrentAccount] = useState("");
    const [loading, setLoading] = useState(true);
    const [supplyChain, setSupplyChain] = useState(null);
    const [roles, setRoles] = useState({
        rms: [],
        man: [],
        dis: [],
        ret: [],
    });

    const [newRole, setNewRole] = useState({
        address: "",
        name: "",
        place: "",
        type: "rms",
    });

    useEffect(() => {
        loadWeb3().then(loadBlockchainData);
    }, []);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert("Non-Ethereum browser detected. Consider using MetaMask!");
        }
    };

    const loadBlockchainData = async () => {
        try {
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts();
            setCurrentAccount(accounts[0]);

            const contract = new web3.eth.Contract(SupplyChainABI.abi, SupplyChainAddress.address);
            setSupplyChain(contract);

            const [rmsCount, manCount, disCount, retCount] = await Promise.all([
                contract.methods.rmsCtr().call(),
                contract.methods.manCtr().call(),
                contract.methods.disCtr().call(),
                contract.methods.retCtr().call(),
            ]);

            const rms = await Promise.all(Array.from({ length: parseInt(rmsCount) }, (_, i) => contract.methods.RMS(i + 1).call()));
            const man = await Promise.all(Array.from({ length: parseInt(manCount) }, (_, i) => contract.methods.MAN(i + 1).call()));
            const dis = await Promise.all(Array.from({ length: parseInt(disCount) }, (_, i) => contract.methods.DIS(i + 1).call()));
            const ret = await Promise.all(Array.from({ length: parseInt(retCount) }, (_, i) => contract.methods.RET(i + 1).call()));

            setRoles({ rms, man, dis, ret });
            setLoading(false);
        } catch (error) {
            console.error("Contract load failed:", error);
            alert("The smart contract is not deployed to the current network or could not be accessed.");
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewRole((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRoleSubmit = async (event) => {
        event.preventDefault();
        const { address, name, place, type } = newRole;

        try {
            let receipt;
            switch (type) {
                case "rms":
                    receipt = await supplyChain.methods.addRMS(address, name, place).send({ from: currentAccount });
                    break;
                case "man":
                    receipt = await supplyChain.methods.addManufacturer(address, name, place).send({ from: currentAccount });
                    break;
                case "dis":
                    receipt = await supplyChain.methods.addDistributor(address, name, place).send({ from: currentAccount });
                    break;
                case "ret":
                    receipt = await supplyChain.methods.addRetailer(address, name, place).send({ from: currentAccount });
                    break;
                default:
                    alert("Invalid role type selected.");
                    return;
            }
            if (receipt) {
                console.log("Role added successfully:", receipt);
                loadBlockchainData(); // Refresh data
            }
        } catch (err) {
            console.error("Transaction failed:", err);
            const message = err?.data?.message || err?.message || "Unknown error occurred.";
            alert("Transaction failed:\n" + message);
        }
    };

    if (loading) return <h1 className="wait">Loading...</h1>;

    return (
        <div className="assign-roles-container">
            <div className="header-container">
                <span><b>Current Account:</b> {currentAccount}</span>
                <span onClick={() => history.push('/')} className="btn btn-outline-danger btn-sm home-button">HOME</span>
            </div>

            <h4>Assign Roles</h4>
            <form onSubmit={handleRoleSubmit} className="role-form">
                <div className="form-group">
                    <select className="form-control-sm" name="type" onChange={handleInputChange} value={newRole.type} required>
                        <option value="rms">Raw Material Supplier</option>
                        <option value="man">Manufacturer</option>
                        <option value="dis">Distributor</option>
                        <option value="ret">Retailer</option>
                    </select>
                </div>
                <div className="form-group">
                    <input className="form-control-sm" type="text" name="address" placeholder="Ethereum Address" onChange={handleInputChange} value={newRole.address} required />
                </div>
                <div className="form-group">
                    <input className="form-control-sm" type="text" name="name" placeholder="Name" onChange={handleInputChange} value={newRole.name} required />
                </div>
                <div className="form-group">
                    <input className="form-control-sm" type="text" name="place" placeholder="Based In" onChange={handleInputChange} value={newRole.place} required />
                </div>
                <button className="btn btn-outline-success btn-sm">Register</button>
            </form>

            <h4>Registered Roles</h4>
            {["rms", "man", "dis", "ret"].map((roleType) => (
                <div key={roleType}>
                    <h5>{roleType.toUpperCase()}s:</h5>
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Place</th>
                                <th>Ethereum Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles[roleType].map((role, index) => (
                                <tr key={index}>
                                    <td>{role.id}</td>
                                    <td>{role.name}</td>
                                    <td>{role.place}</td>
                                    <td>{role.addr}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

export default AssignRoles;
