import React from "react";
import { Menu } from "lucide-react"; // or use @mui/icons-material/Menu if you're using MUI

const ContactSupportPage = ({ toggleSidebar }) => {
  return (
    <div className="min-h-screen bg-white px-4 py-12 md:px-24 md:py-20 font-sans">
      <div className=
      "max-w-6xl mx-auto">
        {/* Header */}
        
        <div className="mb-6 md:mb-8 flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-[var(--color-text)]">
            Support 
          </h1>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left side: Contact Form */}
          <div className="bg-gray-50 p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Contact our sales team</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  className="border rounded px-4 py-2 w-full"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  className="border rounded px-4 py-2 w-full"
                  required
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="you@company.com"
                className="border rounded px-4 py-2 w-full"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="+233 400 000 000"
                className="border rounded px-4 py-2 w-full"
                required
              />
              <select name="teamSize" className="border rounded px-4 py-2 w-full">
                <option>1-50 people</option>
                <option>51-100 people</option>
                <option>101-500 people</option>
                <option>500+ people</option>
              </select>
              <select name="location" className="border rounded px-4 py-2 w-full">
                <option>Ghana</option>
                <option>USA</option>
                <option>UK</option>
              </select>
              <textarea
                name="message"
                placeholder="Leave us a message..."
                className="border rounded px-4 py-2 w-full h-24"
              ></textarea>

              <fieldset>
                <legend className="text-sm font-medium text-gray-700 mb-2">
                  Which products are you interested in?
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Untitled Mail",
                    "Untitled VPN",
                    "Untitled Calendar",
                    "Untitled Workspace",
                    "Untitled Drive",
                    "Other",
                  ].map((item) => (
                    <label key={item} className="inline-flex items-center space-x-2">
                      <input type="checkbox" name="products" value={item} />
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
              >
                Send message
              </button>
            </form>
          </div>

          {/* Right side: Contact Info */}
          <div className="text-sm text-gray-700 space-y-6">
            <div>
              <h3 className="font-semibold text-base">Chat to sales</h3>
              <p>Interested in switching? Speak to our friendly team.</p>
              <a href="mailto:sales@untitledui.com" className="text-indigo-600">
                sales@untitledui.com
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-base">Email support</h3>
              <p>Email us and we'll get back to you within 24 hours.</p>
              <a href="mailto:support@untitledui.com" className="text-indigo-600">
                support@untitledui.com
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-base">Chat support</h3>
              <p>Chat to our staff 24/7 for instant access to support.</p>
              <a href="#" className="text-indigo-600">
                Start live chat <span className="text-green-600 ml-1">● Online</span>
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-base">Call us</h3>
              <p>Mon – Fri, 9:00 AM – 5:00 PM (UTC/GMT +10.00).</p>
              <p>
                <a href="tel:1300132642" className="text-indigo-600">
                  1300 132 642
                </a>
              </p>
              <p>
                <a href="tel:+61402002024" className="text-indigo-600">
                +233 
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base">Melbourne</h3>
              <p>Visit our office Mon – Fri, 9:00 AM – 5:00 PM.</p>
              <p>
                10 slater avenue Street
                <br />
                Fitzroy VIC 3065 Ghana
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base">Accra</h3>
              <p>Visit our office Mon – Fri, 9:00 AM – 5:00 PM.</p>
              <p>
                John E.Atta Mills Street
                <br />
                Accra NSW 2000 Ghana
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupportPage;
