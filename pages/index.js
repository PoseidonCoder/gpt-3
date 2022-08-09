import "regenerator-runtime/runtime";
import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";
import { Mic, MicFill } from "react-bootstrap-icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function Home() {
  const [result, setResult] = useState([
    "LaMDA: Hi, my name's GPT-3. What's yours?",
  ]);
  const [AItyping, setAItyping] = useState(false);
  const chat = useRef(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [promptInput, setPromptInput] = useState("");

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });
  const stopListening = () =>
    SpeechRecognition.stopListening() && resetTranscript();

  async function onSubmit(event) {
    event.preventDefault();

    setPromptInput("");

    let newResult = result.concat(["Human: " + promptInput, "LaMDA:"]);
    setAItyping(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: newResult.join("\n") }),
    });

    const data = await response.json();
    newResult[newResult.length - 1] += " " + data.result.split("\n").join("");
    setResult(newResult);
    setAItyping(false);
    chat.current.scrollTop = chat.current.scrollHeight;

    let msg = new SpeechSynthesisUtterance();
    msg.text = data.result;
    window.speechSynthesis.speak(msg);

    console.log(newResult);
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (window) chat.current.style.height = window.innerHeight - 100 + "px";
  }, []);

  useEffect(() => {
    setPromptInput(transcript);
  }, [transcript]);

  return (
    <div>
      <div
        style={{
          position: "absolute",
          left: "25%",
          top: "25%",
          backgroundColor: "tomato",
          color: "white",
          padding: "2rem",
          boxSizing: "border-box",
          boxShadow: "10px 10px 10px lightgray",
        }}
        className="rounded"
      >
        This website is temporarily shut down due to the unexpected high volume
        of usage. Sorry ):
      </div>
      <Head>
        <title>GPT-3-CHAT</title>
      </Head>

      <main>
        <div className="text-center mb-0">
          <h1>Talk with GPT-3!</h1>
          <a href="https://gpt-3-digital-human.netlify.app/">
            digital human version
          </a>
        </div>

        <div className="mx-auto" style={{ width: "60%" }}>
          <div className="px-5" style={{ overflow: "scroll" }} ref={chat}>
            {result.length === 0 ? (
              <p className="text-center text-secondary">Type something!</p>
            ) : (
              result
                .map((message, i) => {
                  let author;
                  if (message.startsWith("LaMDA:")) {
                    author = "LaMDA";
                    message = message.slice(6);
                  } else if (message.startsWith("Human:")) {
                    author = "Human";
                    message = message.slice(6);
                  }

                  if (author) {
                    const style = "p-2 rounded";
                    return (
                      <p
                        className={
                          author === "Human"
                            ? style + " text-white"
                            : style + " text-black"
                        }
                        style={{
                          backgroundColor:
                            author === "Human" ? "#218aff" : "#d8d8d8",
                          width: "fit-content",
                          maxWidth: "70%",
                          marginLeft: author === "Human" ? "auto" : "",
                        }}
                        key={i}
                      >
                        {message}
                      </p>
                    );
                  } else {
                    return false;
                  }
                })
                .filter((message) => message)
            )}
          </div>
          <form onSubmit={onSubmit}>
            <InputGroup className="fixed-bottom">
              {browserSupportsSpeechRecognition && (
                <Button
                  type="button"
                  size="lg"
                  onTouchStart={startListening}
                  onMouseDown={startListening}
                  onTouchEnd={stopListening}
                  onMouseUp={stopListening}
                  disabled={AItyping}
                  variant="dark"
                >
                  {listening ? <MicFill /> : <Mic />}
                </Button>
              )}
              <FormControl
                minLength={4}
                type="text"
                name="prompt"
                size="lg"
                value={promptInput}
                autoComplete="off"
                disabled={AItyping}
                onChange={(e) => {
                  setPromptInput(e.target.value);
                  resetTranscript();
                }}
              />
              <Button size="lg" type="submit" disabled={AItyping}>
                send
              </Button>
            </InputGroup>
          </form>
        </div>
      </main>
    </div>
  );
}
