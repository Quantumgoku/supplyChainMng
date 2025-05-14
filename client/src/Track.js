import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./contracts/SupplyChain.json";
import SupplyChainAddress from "./contracts/SupplyChain-address.json";
import { QRCodeCanvas } from 'qrcode.react';

function Track() {
    const history = useHistory();
    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState({});
    const [MedStage, setMedStage] = useState({});
    const [ID, setID] = useState();
    const [RMS, setRMS] = useState({});
    const [MAN, setMAN] = useState({});
    const [DIS, setDIS] = useState({});
    const [RET, setRET] = useState({});
    const [TrackTillSold, showTrackTillSold] = useState(false);
    const [TrackTillRetail, showTrackTillRetail] = useState(false);
    const [TrackTillDistribution, showTrackTillDistribution] = useState(false);
    const [TrackTillManufacture, showTrackTillManufacture] = useState(false);
    const [TrackTillRMS, showTrackTillRMS] = useState(false);
    const [TrackTillOrdered, showTrackTillOrdered] = useState(false);

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
            alert("Non-Ethereum browser detected. Consider using MetaMask!");
        }
    };

    const loadBlockchaindata = async () => {
        try {
            setloader(true);
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts();
            setCurrentaccount(accounts[0]);

            // Load the SupplyChain contract
            const supplychain = new web3.eth.Contract(SupplyChainABI.abi, SupplyChainAddress.address);
            setSupplyChain(supplychain);

            // Fetch all medicines
            const medCtr = await supplychain.methods.medicineCtr().call();
            const med = {};
            const medStage = {};
            for (let i = 0; i < medCtr; i++) {
                med[i + 1] = await supplychain.methods.MedicineStock(i + 1).call();
                medStage[i + 1] = await supplychain.methods.showStage(i + 1).call();
            }

            setMED(med);
            setMedStage(medStage);

            // Fetch Raw Material Suppliers (RMS)
            const rmsCtr = await supplychain.methods.rmsCtr().call();
            const rms = {};
            for (let i = 0; i < rmsCtr; i++) {
                rms[i + 1] = await supplychain.methods.RMS(i + 1).call();
            }
            setRMS(rms);

            // Fetch Manufacturers (MAN)
            const manCtr = await supplychain.methods.manCtr().call();
            const man = {};
            for (let i = 0; i < manCtr; i++) {
                man[i + 1] = await supplychain.methods.MAN(i + 1).call();
            }
            setMAN(man);

            // Fetch Distributors (DIS)
            const disCtr = await supplychain.methods.disCtr().call();
            const dis = {};
            for (let i = 0; i < disCtr; i++) {
                dis[i + 1] = await supplychain.methods.DIS(i + 1).call();
            }
            setDIS(dis);

            // Fetch Retailers (RET)
            const retCtr = await supplychain.methods.retCtr().call();
            const ret = {};
            for (let i = 0; i < retCtr; i++) {
                ret[i + 1] = await supplychain.methods.RET(i + 1).call();
            }
            setRET(ret);

            setloader(false);
        } catch (error) {
            console.error("Error loading blockchain data:", error);
            alert("The smart contract is not deployed or connection failed.");
        }
    };

    const handleTrack = () => {
        const stage = MedStage[ID];
        if (stage === 5) showTrackTillSold(true);
        else if (stage === 4) showTrackTillRetail(true);
        else if (stage === 3) showTrackTillDistribution(true);
        else if (stage === 2) showTrackTillManufacture(true);
        else if (stage === 1) showTrackTillRMS(true);
        else showTrackTillOrdered(true);
    };

    const handleTrackAnother = () => {
        showTrackTillSold(false);
        showTrackTillRetail(false);
        showTrackTillDistribution(false);
        showTrackTillManufacture(false);
        showTrackTillRMS(false);
        showTrackTillOrdered(false);
    };

    const handlerChangeID = (event) => setID(event.target.value);

    if (loader) return <div><h1 className="wait">Loading...</h1></div>;

    if (TrackTillSold || TrackTillRetail || TrackTillDistribution || TrackTillManufacture || TrackTillRMS || TrackTillOrdered) {
        const medicineData = {
            id: MED[ID]?.id,
            name: MED[ID]?.name,
            description: MED[ID]?.description,
            currentStage: MedStage[ID],
        };

        const medicineDataString = JSON.stringify(medicineData);

        return (
            <div className="container-xl">
                <article className="col-4">
                    <h3><b><u>Medicine:</u></b></h3>
                    <span><b>Medicine ID: </b>{MED[ID]?.id}</span><br />
                    <span><b>Name:</b> {MED[ID]?.name}</span><br />
                    <span><b>Description: </b>{MED[ID]?.description}</span><br />
                    <span><b>Current stage: </b>{MedStage[ID]}</span>
                </article>
                <hr />
                <br />
                <h5>Medicine Tracking:</h5>
                <QRCodeCanvas value={medicineDataString} />
                <button onClick={handleTrackAnother} className="btn btn-outline-success btn-sm">Track Another Item</button>
                <span onClick={() => history.push('/')} className="btn btn-outline-danger btn-sm"> HOME</span>
            </div>
        );
    }

    return (
        <div>
            <span><b>Current Account Address:</b> {currentaccount}</span>
            <span onClick={() => history.push('/')} className="btn btn-outline-danger btn-sm"> HOME</span>
            <h5>Enter Medicine ID to Track it</h5>
            <form onSubmit={handleTrack}>
                <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Enter medicine ID" required />
                <button className="btn btn-outline-success btn-sm" type="submit">Track</button>
            </form>
            <table className="table table-sm table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Medicine ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Current Processing Stage</th>
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
    );
}

export default Track;
