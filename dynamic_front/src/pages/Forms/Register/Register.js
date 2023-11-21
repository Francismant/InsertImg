import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./Register.module.scss";
import { useNavigate } from "react-router-dom";

export default function Register({ seeLoginForm }) {
  const [feedback, setFeedBack] = useState("");
  const [feedbackGood, setFeedBackGood] = useState("");
  const [errorAvatar, setErrorAvatar] = useState("");
  const avatarRef = useRef();
  const navigate = useNavigate();

  const yupSchema = yup.object({
    email: yup
      .string()
      .required("Le champ est obligatoire")
      .email("Vous devez saisir un email valide"),
    password: yup
      .string()
      .required("Le champ est obligatoire")
      .min(5, "Mot de passe trop court")
      .max(10, "Mot de passe trop long"),
  });

  const defaultValues = {
    password: "",
    email: "",
    avatar: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(yupSchema),
  });

  async function submit() {
    setFeedBack("");
    const values = getValues();
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    if (avatarRef.current && avatarRef.current.files[0]) {
      const maxFilseSize = 5000000;
      if (avatarRef.current.files[0].size > maxFilseSize) {
        setErrorAvatar("Le fichier est trop volumineux");
        return;
      }
      const supportExtensions = ["jpg", "jpeg", "png", "avif"];
      const fileExtension = avatarRef.current.files[0].name
        .split(".")
        .pop()
        .toLowerCase();
      if (!supportExtensions.includes(fileExtension)) {
        setErrorAvatar("Format de fichier non supporté");
      }
      formData.append("avatar", avatarRef.current.files[0]);
    }

    const response = await fetch("http://localhost:8000/api/users/register", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const newUser = await response.json();
      if (newUser.message) {
        setFeedBack(newUser.message);
      } else {
        setFeedBackGood(newUser.messageGood);
        reset(defaultValues);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    }
  }

  return (
    <div className="flex-fill d-flex flex-column justify-content-center align-items-center">
      <form onSubmit={handleSubmit(submit)}>
        <div className="d-flex flex-column mb10">
          <label htmlFor="email" className="mb10">
            Email
          </label>
          <input type="email" id="email" {...register("email")} />
          {errors?.email && (
            <p className={`${styles.feedback}`}>{errors.email.message}</p>
          )}
        </div>
        <div className="d-flex flex-column mb10">
          <label htmlFor="password" className="mb10">
            Password
          </label>
          <input type="password" id="password" {...register("password")} />
          {errors?.password && (
            <p className={`${styles.feedback}`}>{errors.password.message}</p>
          )}
        </div>
        <div className="d-flex flex-column mb20">
          <label htmlFor="avatar" className="mb10">
            Avatar
          </label>
          <input type="file" id="avatar" ref={avatarRef} />
          {errorAvatar && (
            <p className={`${styles.feedback} mb20`}>{errorAvatar}</p>
          )}
        </div>
        {feedback && <p className={`${styles.feedback} mb20`}>{feedback}</p>}
        {feedbackGood && (
          <p className={`${styles.feedbackGood} mb20`}>{feedbackGood}</p>
        )}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
