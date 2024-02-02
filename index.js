/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
// import data from "./tracksSmall.json";
import data from "./playlistinfo.json" assert { type: "json" };
import { DeconstructJSON, GetInfoForList, GetMagicNumber } from "./jsonStuff";

const wrapper = document.querySelector(".link");
const currentSong = "";

const songsLeft = (() => {
  const songs_left = document.querySelector(".value");
  songs_left.innerHTML = data.length;
})();

const AddTierEvents = (() => {
  const tierButtons = document.querySelectorAll(".tier-button");
  tierButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = `#${button.innerHTML}`;
      const counter = document.querySelector(id);
      // update saved data
      counter.innerHTML = Number(counter.innerHTML) + 1;
      localStorage.setItem(`count: ${counter.id}`, counter.innerHTML);

      RemoveCurrentSong();
      AddToTierList(id);
      IncreaseTotal();
      DecreaseSongsLeft();

      GetNextSong(Number(localStorage.getItem("song-count")));
    });
  });
})();

const AddExpansionButtons = (() => {
  const expansionButtons = document.querySelectorAll(".expansion");
  expansionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("closed")) {
        ShowTierList(button);
        button.classList.remove("closed");
      } else {
        CloseTierList(button);
        button.classList.add("closed");
      }
    });
  });
})();
const AddToTierList = (id, Title, Src) => {
  // when button is clicked
  if (Title === undefined && Src === undefined) {
    const songWrapper = document.querySelector(`${id}-tier`);
    const songDiv = document.createElement("div");
    songDiv.classList.add("song");
    const info = GetInfoForList(
      data[Number(localStorage.getItem("song-count"))]
    );

    const img = document.createElement("img");
    img.src = info.imgLink;
    img.title = info.name;

    songDiv.appendChild(img);

    // save the addition
    SaveTier(img, id);

    songWrapper.appendChild(songDiv);
  }
  // when loaded in
  else {
    const songWrapper = document.querySelector(`${id}-tier`);
    const songDiv = document.createElement("div");
    songDiv.classList.add("song");

    const img = document.createElement("img");
    img.src = Src;
    img.title = Title;

    songDiv.appendChild(img);

    songWrapper.appendChild(songDiv);
  }
};

const IncreaseTotal = () => {
  const p = document.querySelector(".total");
  p.innerHTML = Number(p.innerHTML) + 1;
  // increase song count
  localStorage.setItem(
    "song-count",
    Number(localStorage.getItem("song-count")) + 1
  );
};
const DecreaseSongsLeft = () => {
  const songs_left = document.querySelector(".value");
  localStorage.setItem(
    "songs-left",
    Number(localStorage.getItem("songs-left")) - 1
  );
  songs_left.innerHTML = localStorage.getItem("songs-left");
};

const RemoveCurrentSong = () => {
  if (wrapper.hasChildNodes()) {
    wrapper.removeChild(wrapper.lastChild);
  }
};

const GetNextSong = (index) => {
  const iframe = document.createElement("iframe");
  iframe.style.borderRadius = "12px";
  iframe.style.border = "none";
  try {
    iframe.src = DeconstructJSON(data[index]);
  } catch {
    GetTier("S");
    GetTier("A");
    GetTier("B");
    GetTier("C");
    GetTier("D");
  }

  iframe.style.width = "100%";
  iframe.style.height = "352px";
  iframe.allowFullscreen = "";
  iframe.allow =
    "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
  iframe.loading = "lazy";
  wrapper.appendChild(iframe);
};

const ShowTierList = (button) => {
  const expansion = button.nextElementSibling;
  expansion.style.display = "block";
  // expansion.style.transform ="scale(1)"
};

const CloseTierList = (button) => {
  const expansion = button.nextElementSibling;
  expansion.style.display = "none";
  // expansion.style.transform ="scale(0)"
};

const SaveTier = (img, TierID) => {
  const tierString = TierID[1];
  // use current song count as ID
  const ID = localStorage.getItem("song-count");
  // save title
  localStorage.setItem(`${ID}title`, img.title);
  // save img src
  localStorage.setItem(`${ID}src`, img.src);

  // save tier
  localStorage.setItem(`${ID}tier-`, tierString);
};

const LoadTier = (songCount) => {
  const title = localStorage.getItem(`${songCount.toString()}title`);
  const src = localStorage.getItem(`${songCount.toString()}src`);
  const tier = `#${localStorage.getItem(`${songCount.toString()}tier-`)}`;

  AddToTierList(tier, title, src);
};

function GetTier(id) {
  const songsArray = [];
  const songs = document.querySelector(`#${id.toUpperCase()}-tier`).childNodes;
  for (let i = 0; i < songs.length; i++) {
    songsArray.push(songs[i].childNodes[0].title);
  }

  console.log(songsArray);
}

const Start = (() => {
  // get current song
  if (localStorage.getItem("song-count") == null) {
    localStorage.setItem("song-count", "0");
    GetNextSong(Number(localStorage.getItem("song-count")));

    // set all totals and shit for the tier counters
    // tier counters
    const countList = document.querySelectorAll(".count");
    countList.forEach((counter) => {
      counter.innerHTML = "0";
      localStorage.setItem(`count: ${counter.id}`, counter.innerHTML);
    });

    // totals
    const total = document.querySelector(".total");
    total.innerHTML = 0;
    // don't save as song count is the same

    const songsLeft = document.querySelector(".value");
    songsLeft.innerHTML = data.length;
    localStorage.setItem("songs-left", songsLeft.innerHTML);
  } else {
    GetNextSong(Number(localStorage.getItem("song-count")));
    // load all totals and shit
    const countList = document.querySelectorAll(".count");
    countList.forEach((counter) => {
      counter.innerHTML = localStorage.getItem(`count: ${counter.id}`);
    });

    // totals
    const total = document.querySelector(".total");
    total.innerHTML = localStorage.getItem("song-count");

    // songs left
    const songsLeft = document.querySelector(".value");
    songsLeft.innerHTML = localStorage.getItem("songs-left");

    // load tier lists
    for (let i = 0; i < Number(localStorage.getItem("song-count")); i++) {
      LoadTier(i);
    }
  }
})();
