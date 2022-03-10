import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../hooks/useContext";
import axios from "axios";
import { Input, TextArea } from "../common/Input";
import { useSettings } from "../../hooks/useSettings";
import Button from "../common/Button";
import { BASE_URL } from "../../constants/contants";
import "./scss/editProfile.scss";
import Swal from "sweetalert2";

const EditProfile = () => {
  const msg: any = useContext(UserContext);

  const { selectPhoto, image } = useSettings();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bioData: "",
    profilePic: "",
  });

  useEffect(() => {
    const getUserProfile = async () => {
      const response = await fetch(`${BASE_URL}profile/${msg.user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${msg.token}`,
        },
      });
      let responseData = await response.json();
      // console.log(responseData.user, "dfhdfenfbdnbfdnfdbx");

      setFormData({
        firstName: responseData.user.firstName,
        lastName: responseData.user.lastName,
        bioData: responseData.user.bioData,
        profilePic: responseData.user.profilePic,
      });
    };
    getUserProfile();
  }, []);

  const handleInputChange = (e: any) => {
    let name: string = e.currentTarget.name;
    let value: string = e.currentTarget.value;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
  };

  const saveImage = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}profile/picture`,
        image.formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${msg.token}`,
          },
        }
      );

      let data = response.data;
      console.log(data);
      Swal.fire({
        icon: "success",
        title: "Updated profile picture successfully",
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (error: any) {
      console.log(error.response.data);
      Swal.fire({
        icon: "error",
        title: "An error occured",
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };
  const handleSubmit = async () => {
    // console.log("send form data", formData);
    try {
      const response = await fetch(`${BASE_URL}profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${msg.token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          bioData: formData.bioData,
        }),
      });

      let data = await response.json();
      setFormData({ ...formData, ...data.profile });
      Swal.fire({
        icon: "success",
        title: "Updated profile successfully",
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (error: any) {
      console.log(error.response.data);
      Swal.fire({
        icon: "error",
        title: "An error occured",
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  return (
    <div className="container edit-profile">
      <div className="navigation">
        <div className="back"></div>
        <div className="change-password"></div>
      </div>

      <div className="form-container">
        <div className="heading">
          <div>
            <h3>Change Info</h3>
            <p>Changes will be reflected to every services</p>
          </div>
          <div>
            <a href="/changePassword">change password</a>
          </div>
        </div>

        <div className="change-profile-pics">
          <label htmlFor="upload-button">
            <div className="photo-input">
              <img
                src={
                  image.preview ||
                  formData.profilePic ||
                  "https://res.cloudinary.com/ckgraphics/image/upload/v1644925390/tweeterclone/undraw_profile_pic_ic5t_rkejzu_lqnnhr.png"
                }
                alt=""
              />
              <FontAwesomeIcon icon={faCamera} />
            </div>
          </label>
          <form onSubmit={saveImage}>
            <input
              type="file"
              accept=".png, .jpg, .jpeg, .gif"
              id="upload-button"
              onChange={selectPhoto}
            />

            <button type="submit" className="btn btn-primary">
              Upload
            </button>
          </form>
        </div>
        <div className="form-fields">
          <Input
            onChange={handleInputChange}
            placeholder="Enter your first name"
            name="firstName"
            label="First Name"
            type="text"
            value={formData.firstName}
          />
          <Input
            onChange={handleInputChange}
            placeholder="Enter your last name"
            name="lastName"
            label="Last Name"
            type="text"
            value={formData.lastName}
          />
          <TextArea
            onChange={handleInputChange}
            placeholder="Enter your bio"
            name="bioData"
            label="Bio Data"
            value={formData.bioData}
          />
          {/* <Input
              onChange={handleInputChange}
              placeholder="Enter your email"
              name="email"
              label="Email"
              type="email"
              value={formData.email}
            /> */}
          <Button className="btn-primary" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
