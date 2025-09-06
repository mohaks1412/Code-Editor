import React, { useEffect, useState } from 'react'
import AudioBoard from '../Utils/AudioBoard'
import RecordBtn from '../Utils/RecordBtn'
import IDE from '../Utils/IDE'
import Sidebar from '../Utils/fileSystem/Sidebar'
import Outputpane from './Outputpane'
import './DevWorkspace.css'
import { useSelector } from 'react-redux'
import DeleteAudio from '../Utils/DeleteAudio'
import store from '../../store/store'

const DevWorkspace = () => {
  const filesInStore = useSelector(state => state.code.files)

  const [debouncedHtml, setDebouncedHtml] = useState("")

  function extractAssets(htmlCode) {
    const assets = {
      css: [],
      js: [],
      images: [],
      media: [],
      others: []
    };

    let match;

    // --- CSS ---
    const cssRegex = /<link[^>]+href="([^"]+)"[^>]*>/g;
    while ((match = cssRegex.exec(htmlCode)) !== null) {
      const name = match[1];
      const file = filesInStore.find(f => f.filename === name);
      assets.css.push({ name, code: file ? file.code : null });
    }

    // --- JS ---
    const jsRegex = /<script[^>]+src="([^"]+)"[^>]*>\s*<\/script>/g;
    while ((match = jsRegex.exec(htmlCode)) !== null) {
      const name = match[1];
      const file = filesInStore.find(f => f.filename === name);
      assets.js.push({ name, code: file ? file.code : null });
    }

    // --- Images ---
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    while ((match = imgRegex.exec(htmlCode)) !== null) {
      const name = match[1];
      const file = filesInStore.find(f => f.filename === name);
      assets.images.push({ name, code: file ? file.code : null });
    }

    // --- Media ---
    const mediaRegex = /<(?:audio|video)[^>]+src="([^"]+)"[^>]*>/g;
    while ((match = mediaRegex.exec(htmlCode)) !== null) {
      const name = match[1];
      const file = filesInStore.find(f => f.filename === name);
      assets.media.push({ name, code: file ? file.code : null });
    }

    return assets;
  }

  function inlineAssets(htmlCode, filesObj) {
    let output = htmlCode;

    if (filesObj.css) {
      filesObj.css.forEach(file => {
        const regex = new RegExp(`<link[^>]*href=["']${file.name}["'][^>]*>`, "g");
        const inlineTag = `<style>\n${file.code}\n</style>`;
        output = output.replace(regex, inlineTag);
      });
    }

    if (filesObj.js) {
      filesObj.js.forEach(file => {
        const regex = new RegExp(`<script[^>]*src=["']${file.name}["'][^>]*></script>`, "g");
        const inlineTag = `<script>\n${file.code}\n</script>`;
        output = output.replace(regex, inlineTag);
      });
    }

    if (filesObj.images) {
      filesObj.images.forEach(file => {
        const regex = new RegExp(`src=["']${file.name}["']`, "g");
        output = output.replace(regex, `src="${file.code}"`);
      });
    }

    if (filesObj.media) {
      filesObj.media.forEach(file => {
        const regex = new RegExp(`src=["']${file.name}["']`, "g");
        output = output.replace(regex, `src="${file.code}"`);
      });
    }

    return output;
  }


  // Grab index.html content
  const htmlFile = useSelector(state =>
    state.code.files.find(file => file.filename === "index.html")
  )
  const rawHtmlCode = htmlFile ? htmlFile.code : ""

  // Debounce iframe updates
  useEffect(() => {
    const handler = setTimeout(() => {
      const auxFiles = extractAssets(rawHtmlCode)
      const inlined = inlineAssets(rawHtmlCode, auxFiles)
      setDebouncedHtml(inlined)
    }, 400) // debounce delay (ms)

    return () => clearTimeout(handler)
  }, [rawHtmlCode, filesInStore])

  return (
    <div className="devworkspace-container">
      <div className="devworkspace-topbar">
        <RecordBtn/>
        <DeleteAudio />
      </div>
      <AudioBoard />
      <div className="devworkspace-main">
        <div className="devworkspace-sidebar">
          <Sidebar />
        </div>

        <div className="devworkspace-ide">
          <IDE />
        </div>

        <div className="devworkspace-outputpane">
          <Outputpane code={debouncedHtml} />
        </div>
      </div>
    </div>
  )
}

export default DevWorkspace
