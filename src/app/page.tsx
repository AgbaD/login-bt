"use client";
import { fetchInvoiceTemplates, saveInvoiceSettings } from "@/api/invoice";
import useRequest from "@/hooks/useRequest";
import React, { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import "./page.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faImage } from "@fortawesome/free-solid-svg-icons";
import BaseInput from "@/components/input";
import parse from "html-react-parser";
import {
  extractStyles,
  parseCSS,
  parseHTML,
  renderHTML,
} from "@/utils/helper.utils";
import { InvoiceSettingDto, Layout } from "@/utils/interface.utils";
import { HexColorPicker } from "react-colorful";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [templateNames, setTemplateNames] = useState<any[]>([]);
  const [templatesContent, setTemplateContent] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [selectedLayout, setSelectedLayout] = useState<string>("");
  const [formData, setFormData] = useState<InvoiceSettingDto>({
    Layout: "",
    BusinessName: "",
    Terms: "",
    BankName: "",
    AccountNumber: "",
    AccountName: "",
    FontStyle: "",
    FontColor: "",
    BackgroundColor: "",
  });
  const [logo, setLogo] = useState<string | null>(null);
  const uploadAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { makeRequest: fetchInvoiceTemplateRequest } = useRequest(
    fetchInvoiceTemplates
  );
  const { makeRequest: saveInvoiceSettingsRequest } =
    useRequest(saveInvoiceSettings);

  const getHTML = () => {
    if (selectedIndex !== undefined && selectedIndex >= 0) {
      const encoded = templatesContent[selectedIndex];
      const html = atob(encoded);
      return html;
    }
    return "";
  };

  const parseInvoivePreview = () => {
    const html = getHTML();
    const htmlRender: string = parseHTML(formData, logo, renderHTML(html));
    return parse(htmlRender);
  };

  const styles = parseCSS(formData, extractStyles(getHTML()));

  const fetchInvoiceTemplates_ = async () => {
    setIsLoading(true);
    const [resp, err] = await fetchInvoiceTemplateRequest();
    if (err) {
      toast.error(err.message);
    }
    const names: string[] = [];
    const content: string[] = [];
    resp?.Payload.map((layout: Layout) => {
      names.push(layout.Name);
      content.push(layout.Content);
    });
    setTemplateNames(names);
    setTemplateContent(content);
    setIsLoading(false);
  };

  const saveInvoiceSettings_ = async (data: InvoiceSettingDto) => {
    setIsLoading(true);
    const [resp, err] = await saveInvoiceSettingsRequest(data);
    if (err) {
      toast.error(err.message);
    }
    toast.success(resp.Message);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInvoiceTemplates_();
  }, []);

  const handleChange = (field: string, value: string | string[]) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: value }));
  };

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
    setFormData((prevFormData) => ({ ...prevFormData, ["Logo"]: file }));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleLayoutSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLayout(value);
    let ind: number = -1;
    templateNames.map((name: string, index: number) => {
      if (name === value) ind = index;
    });
    setSelectedIndex(ind);
    setFormData((prevFormData) => ({ ...prevFormData, ["Layout"]: value }));
  };

  const handleSubmit = () => {
    console.log(formData);
    saveInvoiceSettings_(formData);
  };

  useEffect(() => {
    const uploadArea = uploadAreaRef.current;
    if (uploadArea) {
      uploadArea.addEventListener("drop", handleDrop as EventListener);
      uploadArea.addEventListener("dragover", handleDragOver as EventListener);

      return () => {
        uploadArea.removeEventListener("drop", handleDrop as EventListener);
        uploadArea.removeEventListener(
          "dragover",
          handleDragOver as EventListener
        );
      };
    }
  }, [handleDrop, handleDragOver]);

  return (
    <section className="home-page">
      <div className="navigation-bar">
        <div className="navigation-content page-width">
          <h3>Clearprice Invoice Generator</h3>
          <button className="save-button">
            <FontAwesomeIcon className="upload-icon" icon={faDownload} />
            Save Invoice
          </button>
        </div>

        <div className="page-width">
          <div className="main-container">
            <div className="input-section">
              <>
                <h1>Invoice Fields</h1>
                <p>Fill the fields below to generate an invoice</p>
              </>

              <div className="field">
                <label>Layout Option</label>
                <p className="field-desc">
                  This enable you arrange elements based on predefined options
                </p>
                <select className="text--xs" onChange={handleLayoutSelect}>
                  <option value="">Select an option</option>
                  {templateNames?.map((name: string, index: number) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Business Name</label>
                <BaseInput
                  className="user--input"
                  placeholder="Enter business name"
                  name="BusinessName"
                  required={true}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Terms</label>
                <BaseInput
                  textarea={true}
                  required={true}
                  name="Terms"
                  onChange={handleChange}
                  className="text-area"
                  placeholder="Write here"
                />
              </div>

              <div className="field">
                <label>Business Logo</label>
                <div
                  className="upload-area"
                  ref={uploadAreaRef}
                  onClick={handleClick}
                >
                  <input
                    type="file"
                    required={true}
                    onChange={handleFileInputChange}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />
                  {logo ? (
                    <img
                      src={logo}
                      alt="Business Logo"
                      className="logo-preview"
                    />
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faImage}
                        style={{ color: "#32b670" }}
                        size="2xl"
                      />
                      <p className="upload-instruction">
                        Drop or click here to upload logo
                      </p>
                    </>
                  )}
                </div>
              </div>

              <>
                <h3>Bank details</h3>
                <p>Provide bank details below</p>
              </>

              <div className="field">
                <label>Bank Name</label>
                <BaseInput
                  required={true}
                  name="BankName"
                  className="user--input"
                  placeholder="Enter business name"
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Account Number</label>
                <BaseInput
                  required={true}
                  name="AccountNumber"
                  onChange={handleChange}
                  className="user--input"
                  placeholder="Enter account number"
                />
              </div>

              <div className="field">
                <label>Account Name</label>
                <BaseInput
                  required={true}
                  name="AccountName"
                  onChange={handleChange}
                  className="user--input"
                  placeholder=""
                />
              </div>

              <>
                <h3>Style Customizations</h3>
                <p>Style your invoice your way</p>
              </>

              <div className="field">
                <label>Font Style</label>
                <BaseInput
                  required={true}
                  name="FontStyle"
                  onChange={handleChange}
                  className="user--input"
                  placeholder=""
                />
              </div>

              <div className="double-input">
                <div className="field">
                  <label>Font Color</label>
                  <HexColorPicker
                    color={formData.FontColor}
                    onChange={(color) => handleChange("FontColor", color)}
                  />
                  <p>{formData.FontColor}</p>
                </div>

                <div className="field">
                  <label>Background Color</label>
                  <HexColorPicker
                    color={formData.BackgroundColor}
                    onChange={(color) => handleChange("BackgroundColor", color)}
                  />
                  <p>{formData.BackgroundColor}</p>
                </div>
              </div>

              <button className="save-button" onClick={handleSubmit}>
                <FontAwesomeIcon className="upload-icon" icon={faDownload} />
                Save Invoice
              </button>
            </div>

            <div className="preview-section">
              <style>{styles}</style>
              <div className="preview-invoice">{parseInvoivePreview()}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
