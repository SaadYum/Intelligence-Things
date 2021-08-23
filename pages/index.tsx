import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";

import * as qna from "@tensorflow-models/qna";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import Swal from "sweetalert2";

export default function Home() {
  interface QuestionAndAnswer {
    findAnswers(question: string, context: string): Promise<Answer[]>;
  }
  interface Answer {
    text: string;
    startIndex: number;
    endIndex: number;
    score: number;
  }
  const passageRef = useRef<HTMLTextAreaElement>(null);
  const questionRef = useRef<HTMLInputElement>(null);
  const [answers, setAnswers] = useState<Answer[]>();
  const [model, setModel] = useState<QuestionAndAnswer | null>(null);

  // Load model

  const loadModel = async () => {
    const loadedModel = await qna.load();
    setModel(loadedModel);
    Swal.fire("Model Loaded!");
  };

  // Getting Answer

  const getAnswers = async (e: { which: number }) => {
    if (e.which === 13 && model !== null) {
      console.log("Question Submitted!");

      if (
        passageRef.current &&
        passageRef.current.value &&
        questionRef.current &&
        questionRef.current.value
      ) {
        const passage = passageRef.current.value;
        const question = questionRef.current.value;

        console.log(question);
        const modelAnswers = await model.findAnswers(question, passage);
        setAnswers(modelAnswers);
        console.log(modelAnswers);
      } else {
        Swal.fire({
          title: "Error",
          text: "Please fill the passage area and Question first!",
          icon: "warning",
        });
      }
    }
  };

  // Flow
  useEffect(() => {
    loadModel();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>NLP</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main + " h-5/6"}>
        <div className="relative w-full max-w-lg">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-52 -right-8 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          <div className="absolute top-80 left-30 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-3000"></div>
        </div>
        <div>
          {!model ? (
            <div className="flex flex-col space-y-24  h-full content-center">
              <div className="mx-auto text-2xl">Model Loading</div>
              <Loader type="Circles" color="#a377fc" height={300} width={300} />
            </div>
          ) : (
            <div className=" flex flex-col space-y-8 ">
              <h1 className="text-xl">
                TensorFlow QNA Model with NEXT.JS and Tailwind
              </h1>
              <textarea
                name="passage"
                ref={passageRef}
                id=""
                cols={80}
                rows={10}
                className="myInput scrollbar scrollbar-track-transparent scrollbar-thumb-gray-100 scrollbar-thin scrollbar-thumb-rounded-full"
                placeholder="Enter passage here..."
              ></textarea>
              <input
                ref={questionRef}
                type="text"
                placeholder="Ask Question here..."
                className="myInput"
                onKeyPress={getAnswers}
              />
              <h1 className="text-xl">Answers</h1>
              <div className="px-5 w-full h-52 text-gray-500 bg-gray-100 rounded-lg py-3  space-y-3 scrollbar scrollbar-track-transparent scrollbar-thumb-gray-100 scrollbar-thin scrollbar-thumb-rounded-full">
                <ul>
                  {answers?.length &&
                    answers.map((answer, index) => {
                      return (
                        <li
                          className=" flex flex-row justify-between"
                          key={index + "answer"}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 transform translate-y-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="w-3/4">{answer.text}</p>
                          <div className="flex flex-row">
                            <b>Score:</b>
                            <p className="ml-2">{answer.score.toFixed(2)}</p>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer + " h-1/6"}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Saad Rehman
          {/* <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span> */}
        </a>
      </footer>
    </div>
  );
}
