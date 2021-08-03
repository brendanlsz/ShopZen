import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserAuctions,
  deleteAuctionStart,
  addAuctionStart,
  resolveAuctionStart,
} from "../../redux/Auction/auctions.actions";
import { Link } from "react-router-dom";
import { storage } from "../../firebase/upload";
import { v4 as uuidv4 } from "uuid";

import LoadMore from "../LoadMore";
import Button from "../forms/Button";
import Modal from "../Modal";
import FormInput from "../forms/FormInput";
import FormSelect from "../forms/FormSelect";
import CKEditor from "ckeditor4-react";
import { Tick } from "react-crude-animated-tick";
import Logo from "./../../assets/transparents.png";
import { isMobile, isDesktop, isBrowser } from "react-device-detect";

import "./styles.scss";

const mapState = ({ auctionData, user }) => ({
  auctions: auctionData.userAuctions,
  userID: user.currentUser.id,
});

const ManageAuctions = (props) => {
  const { auctions, userID } = useSelector(mapState);
  const { data, queryDoc, isLastPage } = auctions;
  const dispatch = useDispatch();
  const [hideAuctionModal, setHideAuctionModal] = useState(true);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [auctionCategory, setAuctionCategory] = useState("");
  const [auctionName, setAuctionName] = useState("");
  const [auctionMinimumBid, setAuctionMinimumBid] = useState(0);
  const [auctionDesc, setAuctionDesc] = useState("");
  const [auctionDetails, setAuctionDetails] = useState("");
  const [tick, setTick] = useState(false);

  useEffect(() => {
    dispatch(fetchUserAuctions({ userID }));
  }, []);

  const toggleAuctionModal = () => setHideAuctionModal(!hideAuctionModal);

  const configAuctionModal = {
    hideModal: hideAuctionModal,
    toggleModal: toggleAuctionModal,
  };

  const resetForm = () => {
    setHideAuctionModal(true);
    setAuctionCategory("");
    setAuctionName("");
    setAuctionDesc("");
    setAuctionDetails("");
    setAuctionMinimumBid("");
    setImage(null);
  };

  // useEffect(() => {
  //   setTick(true);
  // }, [documentID])

  const handleAuctionSubmit = (e) => {
    e.preventDefault();
    const id = uuidv4();
    if (auctionCategory !== "" && image !== null) {
      const uploadTask = storage.ref(`images/${id}-${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref(`images/${id}-${image.name}`)
            .getDownloadURL()
            .then((url) => {
              dispatch(
                addAuctionStart({
                  auctionCategory,
                  auctionName,
                  auctionThumbnail: url,
                  auctionMinimumBid: auctionMinimumBid * 100,
                  numberOfBids: 0,
                  auctionDesc,
                  auctionDetails,
                  lowerCaseName: auctionName.toLowerCase(),
                  imageName: `${id}-${image.name}`,
                })
              );
              resetForm();
            });
        }
      );
    } else if (auctionCategory === "") {
      alert("Please choose a category");
    } else {
      alert("Please add an image");
    }
  };

  const handleLoadMore = () => {
    dispatch(
      fetchUserAuctions({
        userID,
        startAfterDoc: queryDoc,
        persistAuctions: data,
      })
    );
  };

  const configLoadMore = {
    onLoadMoreEvt: handleLoadMore,
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  function sendItem(documentID, auctionName, auctionMinimumBid) {
    props.changeUrl(`https://shopzen.vercel.app/auction/${documentID}`);
    console.log(auctionName)
    props.changeName(`Product Name: ${auctionName}`)
    if(auctionMinimumBid == 0) {
      props.changePrice("Current Highest Bid: No Bids Yet")
    } else {
      props.changePrice(`Current Highest Bid: $${auctionMinimumBid}`)
    }
    props.changeCat(`Listing Type: Auctions`)
    setTick(true);

    setTimeout(() => {
      setTick(false);
    }, 2000);
  }
  if (tick) {
    return (
      <div className={isMobile ? "tick" : "tickD"}>
        <Tick size={250} />
      </div>
    );
  }
  return (
    <div>
      <div className="manageAuctionsmodalversion">
        <Modal {...configAuctionModal}>
          <div className="addNewForm">
            <form onSubmit={handleAuctionSubmit}>
              <h2>Add new Item for Auction</h2>
              <FormInput
                label="Name"
                placeholder="Name of Item"
                required
                type="text"
                value={auctionName}
                handleChange={(e) => setAuctionName(e.target.value)}
              />
              <FormInput
                label="Main image upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <FormSelect
                label="Category"
                className="category"
                required
                options={[
                  {
                    name: "Electronic Devices",
                    value: "Electronic Devices",
                  },
                  {
                    name: "Electronic Accessories",
                    value: "Electronic Accessories",
                  },
                  {
                    name: "Home Appliances",
                    value: "Home Appliances",
                  },
                  {
                    name: "Health and Beauty",
                    value: "Health and Beauty",
                  },
                  {
                    name: "Childcare",
                    value: "Childcare",
                  },
                  {
                    name: "Home and Lifestyle",
                    value: "Home and Lifestyle",
                  },
                  {
                    name: "Men's Fashion",
                    value: "Men's Fashion",
                  },
                  {
                    name: "Women's Fashion",
                    value: "Women's Fashion",
                  },
                  {
                    name: "Cars",
                    value: "Cars",
                  },
                  {
                    name: "Automotive Accessories",
                    value: "Automotive Accessories",
                  },
                  {
                    name: "Properties",
                    value: "Properties",
                  },
                  {
                    name: "Others",
                    value: "others",
                  },
                ]}
                handleChange={(e) => setAuctionCategory(e.target.value)}
              />
              <FormInput
                label="Minimum Bid Price"
                type="number"
                min="0.00"
                max="1000000.00"
                step="0.01"
                placeholder="Minimum Bid Price"
                value={auctionMinimumBid}
                required
                handleChange={(e) => setAuctionMinimumBid(e.target.value)}
              />
              <FormInput
                label="Description"
                type="description"
                required
                handleChange={(evt) => setAuctionDesc(evt.target.value)}
                placeholder="Short description of item"
              />
              <label>Details/Specifications(Optional)</label>
              <CKEditor
                onChange={(evt) => setAuctionDetails(evt.editor.getData())}
              />
              <br />
              <Button type="submit">Add auction</Button>
            </form>
          </div>
        </Modal>
        <table border="0" cellPadding="0" cellSpacing="0">
          <tbody>
            <tr>
              <th></th>
            </tr>
            <tr>
              <th>
                <Button onClick={toggleAuctionModal}>
                  Create Auction for a Product
                </Button>
              </th>
            </tr>
            <tr>
              <td>
                <table
                  className="results"
                  border="0"
                  cellPadding="10"
                  cellSpacing="0"
                >
                  <tbody>
                    {Array.isArray(data) &&
                      data.length > 0 &&
                      data.map((auction, index) => {
                        const {
                          auctionName,
                          auctionThumbnail,
                          currentBidPrice,
                          documentID,
                          bidDetails,
                        } = auction;

                        return (
                          <tr key={index}>
                            <td>
                              <Link to={`/auction/${documentID}`}>
                                <img
                                  className="thumb"
                                  src={auctionThumbnail}
                                  alt="nothumbnail"
                                />
                              </Link>
                            </td>
                            <td>{auctionName}</td>
                            <td>
                              Highest Bid:{" "}
                              {currentBidPrice > 0 ? (
                                <strong>${currentBidPrice / 100}</strong>
                              ) : (
                                <strong>No bids yet</strong>
                              )}
                            </td>

                            <td>
                              <Button onClick={() => sendItem(documentID, auctionName, currentBidPrice/100)}>
                                Send item
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td></td>
            </tr>
            <tr>
              <td>
                <table border="0" cellPadding="10" cellSpacing="0">
                  <tbody>
                    <tr>
                      <td>{!isLastPage && <LoadMore {...configLoadMore} />}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAuctions;
