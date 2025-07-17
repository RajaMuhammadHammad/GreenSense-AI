let step = 0;
let data = {};
let currentChatId = null; // Track current chat session


document.addEventListener("DOMContentLoaded", () => {
  nextStep();
});

function nextStep(inputValue) {
  if (inputValue) appendUserMessage(inputValue);
  showTypingIndicator();

  setTimeout(() => {
    hideTypingIndicator();

    switch (step) {
      case 0:
        askInput("What's your company name?", "company_name", "fas fa-building");
        break;
      case 1:
        askButtons("Which region best describes your primary market?", [
        { value: "North America" },
  { value: "Latin America"},
  { value: "Europe (Western)"},
  { value: "Europe (Eastern)"},
  { value: "Middle East (excl. KSA)"},
  { value: "KSA (Saudi Arabia)"},
  { value: "Africa (Sub-Saharan)"},
  { value: "Africa (North)" },
  { value: "Asia (East)" },
  { value: "Asia (South)" },
  { value: "Asia (Southeast)" },
  { value: "Central Asia" },
  { value: "Oceania"}
        ], "region");
        break;
        case 2:
        askInput("Which major countries do you operate in?", "major_countries","fas fa-building");
        break;
       case 3:
        askInput("Please specify your sector & industry (e.g., Renewable Energy, Pharmaceuticals, AgriTech)", "sector_industry");
        break;
       case 4:
        askButtons("What is your company size?", [
          { value: "0 - 100" },
          { value: "101 - 500" },
          { value: "501 - 1000" },
          { value: "1001 - 2000" },
          { value: "2001 & above" }
        ], "company_size");
        break;
      case 5:
        askButtons("Is your company listed or unlisted?", [
          { value: "Listed", icon: "📈" },
          { value: "Unlisted", icon: "📉" }
        ], "listing_status");
        break;
         case 6:
        askButtons("Do you have a documented sustainability or ESG strategy?", [
          { value: "Yes" },
          { value: "No" },
          { value: "Planning" }
        ], "sustainability_strategy");
        break;
      case 7:
        askButtons("Has your organization set net-zero or science-based targets?", [
          { value: "Yes" },
          { value: "No" },
          { value: "Planning" }
        ], "netzero_targets");
        break;
      case 8:
        askButtons("Do you have a dedicated sustainability officer/team?", [
          { value: "Yes" },
          { value: "No" }
        ], "sustainability_officer");
        break;
      case 9:
        askCheckboxes("Are you aligned with any of the following standards?", [
          { value: "UN SDGs" }, { value: "GRI" }, { value: "ISSB" },
          { value: "SASB" }, { value: "TCFD / TNFD" }, { value: "CDP" },
          { value: "SBTi" }, { value: "ISO 14001" }, { value: "ISO 14064" },
          { value: "EU Taxonomy / CSRD" }, { value: "GHG Protocol" }, { value: "Not aligned with any" }
        ], "global_standards");
        break;
        case 10:
        askButtons("Have you calculated your GHG emissions?", [
          { value: "Yes – Scope 1 & 2 only" },
          { value: "Yes – All scopes (1, 2, and 3)" },
          { value: "No – In progress" },
          { value: "No – Not yet started" }
        ], "emission_status");
        break;
      case 11:
        askInput("What is your total annual GHG emissions (in tCO2e)?", "total_emissions");
        break;
      case 12:
        askButtons("Do you use emission dashboards or monitoring tools?", [
          { value: "Yes – with live dashboards" },
          { value: "Partial tracking (Excel/internal)" },
          { value: "No – manual tracking" },
          { value: "No tools used yet" }
        ], "monitoring_tools");
        break;

           case 13:
        askButtons("What percentage of energy comes from renewable sources?", [
          { value: "0% - 10%" },
          { value: "11% - 30%" },
          { value: "31% - 50%" },
          { value: ">50%" }
        ], "renewable_energy_use");
        break;
      case 14:
        askButtons("Have you conducted an energy audit in the past 2 years?", [
          { value: "Yes" },
          { value: "No" }
        ], "energy_audit");
        break;
      case 15:
        askCheckboxes("Which energy-saving technologies are used?", [
          { value: "LED lighting" }, { value: "Smart HVAC controls" },
          { value: "Motion sensors / smart meters" }, { value: "IE3/IE4 motors" },
          { value: "Building Management System (BMS)" }, { value: "None" }
        ], "energy_tech");
        break;
      case 16:
        askCheckboxes("Are you exploring electrification or decentralized energy?", [
          { value: "Solar" }, { value: "Electric boilers / heat pumps" },
          { value: "EVs or electric fleet" }, { value: "Wind turbines" },
          { value: "Battery storage" }, { value: "Biogas / geothermal" },
          { value: "No, not currently" }
        ], "electrification_options");
        break;


         case 17:
        askInput("What is your total waste generation (tonnes/year)?", "waste_generation");
        break;
      case 18:
        askButtons("What percentage of waste is recycled, reused, or composted?", [
          { value: "<10%" },
          { value: "10%–20%" },
          { value: "21%–50%" },
          { value: ">50%" },
          { value: "Don’t know" }
        ], "waste_recycled");
        break;
      case 19:
        askButtons("Do you have product take-back or repair systems?", [
          { value: "Yes" }, { value: "No" }
        ], "product_takeback");
        break;


      case 20:
        askButtons("Are your offices, warehouses, or factories green-certified?", [
          { value: "LEED" }, { value: "BREEAM" }, { value: "EDGE" },
          { value: "Local system" }, { value: "Not certified" }
        ], "green_buildings");
        break;
      case 21:
        askCheckboxes("What operational systems are used to track resource usage?", [
          { value: "IoT sensors" }, { value: "EMS" }, { value: "Smart water/gas meters" },
          { value: "Excel/manual logs" }, { value: "None" }
        ], "tracking_systems");
        break;
        
      case 22:
        askButtons("Are suppliers required to disclose their emissions or ESG practices?", [
          { value: "Yes" }, { value: "No" }, { value: "Planning" }
        ], "supplier_disclosure");
        break;
      case 23:
        askButtons("Do you assess the carbon impact of purchased goods/services?", [
          { value: "Yes" }, { value: "No" }, { value: "Planning" }
        ], "purchased_goods_impact");
        break;
      case 24 :
        askButtons("Are sustainable procurement policies in place?", [
          { value: "Yes – Formal policy with ESG criteria" },
          { value: "Yes – Informal practices" },
          { value: "No – Not yet" },
          { value: "In development" }
        ], "sustainable_procurement");
        break;
        
      case 25:
        askButtons("Are you operating in water-stressed or high-risk areas?", [
          { value: "Yes" }, { value: "No" }
        ], "water_stress_area");
        break;
      case 26:
        askButtons("Is water reused or recycled within operations?", [
          { value: "Yes – <50% reused/ recycled" },
          { value: "Yes – >50% reused/ recycled" },
          { value: "No – Water is discharged untreated" },
          { value: "Not applicable" }
        ], "water_reuse_status");
        break;
      case 27:
        askButtons("Do you measure total water withdrawal, consumption, and discharge?", [
          { value: "Yes" }, { value: "No" }
        ], "water_measurement");
        break;
      case 28:
        askCheckboxes("Are nature-based solutions used to manage land, water, or biodiversity impacts?", [
          { value: "Green roofs / vertical gardens" },
          { value: "Rainwater harvesting" },
          { value: "Tree planting/reforestation" },
          { value: "Wetlands restoration" },
          { value: "Not in place" }
        ], "nature_based_solutions");
        break;

       case 29:
        askButtons("Are employees trained in sustainability or ESG topics?", [
          { value: "Yes – mandatory training for all" },
          { value: "Optional training available" },
          { value: "Limited to ESG teams" },
          { value: "No training yet" }
        ], "esg_training");
        break;
      case 30:
        askButtons("What percentage of staff are involved in green initiatives or innovation projects?", [
          { value: "<10%" },
          { value: "11% - 30%" },
          { value: "31% - 50%" },
          { value: ">50%" }
        ], "staff_green_involvement");
        break;

      case 31:
        askButtons("Have you conducted climate risk assessments (e.g., TCFD, physical/transition risk)?", [
          { value: "Yes – physical & transition risks assessed" },
          { value: "Partial (only physical/only transition)" },
          { value: "No" },
          { value: "In progress" }
        ], "climate_risk_assessment");
        break;
      case 32:
        askCheckboxes("Have you obtained any of the following ratings?", [
          { value: "MSCI ESG Ratings" },
          { value: "S&P Global ESG Scores" },
          { value: "FTSE Russell ESG Ratings" },
          { value: "Moody’s ESG Solutions" },
          { value: "EcoVadis" },
          { value: "Science Based Targets initiative (SBTi)" },
          { value: "Not Applicable" }
        ], "esg_ratings");
        break;
         case 33:
        askCheckboxes("What are your top 3 sustainability priorities over the next 2–3 years?", [
          { value: "Achieving Net-Zero Emissions / Carbon Neutrality" },
          { value: "Improving ESG Reporting and Regulatory Compliance (e.g., CSRD, ISSB, GRI)" },
          { value: "Transitioning to Renewable Energy Sources" },
          { value: "Implementing Circular Economy Practices (reduce, reuse, recycle)" },
          { value: "Reducing Waste Generation and Increasing Diversion Rates" },
          { value: "Sustainable Procurement and Supply Chain Transparency" },
          { value: "Water Conservation and Resource Management" },
          { value: "Biodiversity, Nature, and Land Use Stewardship" },
          { value: "Climate Risk Assessment and Resilience Planning (e.g., TCFD-aligned)" },
          { value: "Employee Engagement and ESG Training Programs" },
          { value: "Digitalization of Sustainability Data (IoT, AI, real-time dashboards)" }
          ,
          { value: "other" }
        ], "sustainability_priorities");
        break;
        case 34:
  appendBotMessage("✅ Almost done! Just a few more details to complete your sustainability roadmap.");
  setTimeout(() => {
    askInput("Please provide your valid email address:", "email", "fas fa-envelope");
  }, 800);
  break;

        case 35:
           askInput("Provide me your Full name", "Name");
        break;
        
        case 36:
           askInput("Provide us your contact No", "Phone_number");
        break;
        case 37:
        finalizeForm();
        break;
    }

    step++;
  }, 1000 + Math.random() * 1000);
}

function appendBotMessage(message) {
  const chatBox = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.className = "message bot";
  div.innerHTML = `<div class="bot-avatar avatar">🤖</div><div class="message-content">${message}</div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendUserMessage(message) {
  const chatBox = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.className = "message user";
  div.innerHTML = `<div class="user-avatar avatar">🧑</div><div class="message-content">${message}</div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function askInput(question, field, icon = "📝") {
  appendBotMessage(`${icon ? `<i class="${icon}"></i> ` : ""}${question}`);
  const inputArea = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.className = "input-wrapper";
  div.innerHTML = `
    <input type="text" id="userInput" class="input-box" placeholder="Type here..." autofocus />
  `;
  inputArea.appendChild(div);
  inputArea.scrollTop = inputArea.scrollHeight;

  const input = document.getElementById("userInput");
  input.focus();
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleInput(field);
    }
  });
}

function askTextarea(question, field) {
  appendBotMessage(question);
  const chatBox = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.className = "input-wrapper";
  div.innerHTML = `
    <textarea id="userTextarea" class="input-box" rows="4" placeholder="Type here..."></textarea>
  `;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  const textarea = document.getElementById("userTextarea");
  textarea.focus();
  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextarea(field);
    }
  });
}

function askButtons(question, options, field) {
  appendBotMessage(question);
  const chatBox = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.className = "button-group";

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "chat-button";
    btn.innerHTML = `${opt.icon || ""} ${opt.value}`;
    btn.onclick = () => {
      data[field] = opt.value;
      btn.parentNode.remove();
      nextStep(opt.value);
    };
    div.appendChild(btn);
  });

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function askCheckboxes(question, options, field) {
  appendBotMessage(question);
  const chatBox = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.className = "checkbox-group";

  options.forEach(opt => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${opt.value}"> ${opt.icon || ""} ${opt.value}`;
    div.appendChild(label);
  });

  const submitBtn = document.createElement("button");
  submitBtn.innerText = "Submit";
  submitBtn.className = "send-btn";
  submitBtn.onclick = () => {
    const checked = div.querySelectorAll("input[type='checkbox']:checked");
    const values = Array.from(checked).map(c => c.value);
    data[field] = values;
    div.remove();
    nextStep(values.join(", "));
  };

  div.appendChild(submitBtn);
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function handleInput(field) {
  const val = document.getElementById("userInput").value.trim();
  if (!val) return;
  data[field] = val;
  document.getElementById("userInput").parentElement.remove();
  nextStep(val);
}

function handleTextarea(field) {
  const val = document.getElementById("userTextarea").value.trim();
  if (!val) return;
  data[field] = val;
  document.getElementById("userTextarea").parentElement.remove();
  nextStep(val);
}

function showTypingIndicator() {
  const chatBox = document.getElementById("chat-box");
  const typing = document.createElement("div");
  typing.className = "typing-indicator";
  typing.id = "typing-indicator";
  typing.innerHTML = `<div class="dot"></div><div class="dot"></div><div class="dot"></div>`;
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

function finalizeForm() {
  appendBotMessage("✅ Thank you! Generating your sustainability roadmap...");
  document.getElementById("chat-data").value = JSON.stringify(data);
  document.getElementById("clientEmailInput").value = data["email"];
  document.getElementById("chat-form").submit();
}

 

    function selectOption(option, buttonElement) {
      // Remove selected class from all buttons in the same container
      const container = buttonElement.closest('.options-container');
      container.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('selected');
      });

      // Add selected class to clicked button
      buttonElement.classList.add('selected');
    }

    function sendMessage() {
      const input = document.getElementById('user-input');
      const message = input.value.trim();

      if (message === '') return;

      // Add user message to chat
      addMessage(message, 'user');

      // Clear input
      input.value = '';

      // Show typing indicator
      showTypingIndicator();

      // Simulate bot response (replace with actual API call)
      setTimeout(() => {
        hideTypingIndicator();
        addMessage("Thanks for your message! I'm processing your request and will help you create a sustainability roadmap.", 'bot');
      }, 2000);
    }

    function addMessage(text, type) {
      const chatBox = document.getElementById('chat-box');
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${type}`;

      if (type === 'user') {
        messageDiv.innerHTML = `
                    <div class="message-content">${text}</div>
                    <div class="user-avatar avatar">👤</div>
                `;
      } else {
        messageDiv.innerHTML = `
                    <div class="bot-avatar avatar">🤖</div>
                    <div class="message-content">
                        <i class="fas fa-robot"></i> ${text}
                    </div>
                `;
      }

      chatBox.appendChild(messageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

   
    function hideTypingIndicator() {
      const typingIndicator = document.getElementById('typing-indicator');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    }

    // Allow Enter key to send message
    document.getElementById('user-input').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });

    // Auto-focus on input when page loads
    window.addEventListener('load', function () {
      document.getElementById('user-input').focus();
    });



    


// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set up form submission
  const chatForm = document.getElementById('chat-form');
  if (chatForm) {
    chatForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Set up input field for Enter key
  const userInput = document.getElementById('user-input');
  if (userInput) {
    userInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleFormSubmit(e);
      }
    });
  }
});

// Function to handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(document.getElementById('chat-form'));
  const chatData = {};
  formData.forEach((value, key) => {
    chatData[key] = value;
  });
  
  // Add user message to chat UI immediately
  addUserMessageToUI(chatData);
  
  // Show typing indicator
  showTypingIndicator();
  
  // Submit to server
  submitChatToServer(chatData);
}

// Function to add user message to UI
function addUserMessageToUI(chatData) {
  const chatBox = document.getElementById('chat-box');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message user';
  
  // Format the user's input for display
  let displayText = "Starting new sustainability assessment for:";
  if (chatData.company_name) displayText += `<br><strong>Company:</strong> ${chatData.company_name}`;
  if (chatData.sector_industry) displayText += `<br><strong>Industry:</strong> ${chatData.sector_industry}`;
  if (chatData.company_size) displayText += `<br><strong>Size:</strong> ${chatData.company_size}`;
  
  messageDiv.innerHTML = `
    <div class="message-content">${displayText}</div>
    <div class="user-avatar avatar">👤</div>
  `;
  
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to submit data to server
function submitChatToServer(chatData) {
  // Create hidden form for submission
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/generate';
  form.style.display = 'none';
  
  // Add chat data as hidden input
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'chat_data';
  input.value = JSON.stringify(chatData);
  form.appendChild(input);
  
  document.body.appendChild(form);
  form.submit();
}


// Function to show typing indicator
function showTypingIndicator() {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;
  
  const typingDiv = document.createElement('div');
  typingDiv.className = 'typing-indicator';
  typingDiv.id = 'typing-indicator';
  typingDiv.innerHTML = `
    <div class="bot-avatar avatar">🤖</div>
    <div style="color: white; margin-left: 10px;">
      <span>SustainaBot is generating question...</span>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  `;
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to hide typing indicator
function hideTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}







function appendBotMessage(message, timeout = 0) {
  const chatBox = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.className = "message bot temp-message"; // temp-message added for cleanup
  div.innerHTML = `<div class="bot-avatar avatar">🤖</div><div class="message-content">${message}</div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (timeout > 0) {
    setTimeout(() => {
      div.remove();
    }, timeout);
  }
}


function handleInput(field) {
  const val = document.getElementById("userInput").value.trim();
  if (!val) return;

  // Email validation at step 34
  if (field === "email") {
    validateEmailWithAPI(val).then(isValid => {
      if (!isValid) {
        appendBotMessage("❌ The email address appears to be invalid. Please provide a valid email.", 1000);

        return;
      }
      data[field] = val;
      document.getElementById("userInput").parentElement.remove();
      nextStep(val);
    });
  } else {
    data[field] = val;
    document.getElementById("userInput").parentElement.remove();
    nextStep(val);
  }
}





async function validateEmailWithAPI(email) {
  try {
    const response = await fetch("/validate-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email })
    });
    const result = await response.json();
    return result.valid;
  } catch (error) {
    console.error("Email validation failed:", error);
    return false;
  }
}





















