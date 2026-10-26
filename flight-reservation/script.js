const $ = id => document.getElementById(id);
let selectedFlight = null, selectedSeats = [], passengerCount = 1, currentBooking = null;
const templates = [
 {id:"SB101",airline:"SkyBook Airways",depart:"06:30",arrive:"08:00",duration:"1h 30m",baseFare:3200,seats:30},
 {id:"SB202",airline:"Indian Wings",depart:"10:15",arrive:"11:50",duration:"1h 35m",baseFare:4100,seats:30},
 {id:"SB303",airline:"Air Connect",depart:"16:45",arrive:"18:15",duration:"1h 30m",baseFare:3600,seats:30},
 {id:"SB404",airline:"SkyBook Airways",depart:"20:00",arrive:"21:35",duration:"1h 35m",baseFare:4500,seats:30}
];
const multipliers={"Economy":1,"Business":2.5,"First Class":4};
const now=new Date();
const today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,"0"),String(now.getDate()).padStart(2,"0")].join("-");
$("date").min=today;$("date").value=today;

function bookings(){try{const v=JSON.parse(localStorage.getItem("skybookBookings")||"[]");return Array.isArray(v)?v:[]}catch{return[]}}
function saveBookings(v){localStorage.setItem("skybookBookings",JSON.stringify(v))}
function money(v){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(v)}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function route(){return{from:$("from").value,to:$("to").value,date:$("date").value,travelClass:$("travelClass").value}}
function fare(f){return Math.round(f.baseFare*multipliers[route().travelClass])}
function scrollToId(id){$(id).scrollIntoView({behavior:"smooth",block:"start"})}

$("flightForm").addEventListener("submit",e=>{
 e.preventDefault();const r=route();
 if(r.from===r.to)return alert("Departure and destination must be different.");
 if(r.date<today)return alert("Choose today or a future date.");
 passengerCount=Number($("passengers").value);
 const key=[r.from,r.to,r.date,r.travelClass].join("|");
 const all=bookings();
 const flights=templates.map(t=>{
  const id=t.id+"-"+key;
  const occupied=all.filter(b=>b.flightId===id&&b.status==="Confirmed").flatMap(b=>b.seats);
  return{...t,id,...r,occupied,available:Math.max(0,t.seats-new Set(occupied).size)};
 });
 $("searchSummary").textContent=`${r.from} → ${r.to} | ${r.date} | ${r.travelClass} | ${passengerCount} passenger(s)`;
 $("flightResults").innerHTML=flights.map(f=>`
  <article class="flight-card">
   <div><div class="airline-name">${esc(f.airline)}</div><div class="muted">${esc(f.id.split("-")[0])}</div><div class="muted">${esc(f.travelClass)}</div></div>
   <div><div class="flight-time">${f.depart} → ${f.arrive}</div><div class="route-line"><span></span> ✈ <span></span></div><div class="muted">${f.duration}</div></div>
   <div><div class="fare">${money(fare(f))}</div><small class="muted">Per passenger</small><div class="muted">${f.available} seats available</div></div>
   <div><button class="primary-btn" data-flight-id="${esc(f.id)}" ${f.available<passengerCount?"disabled":""}>Select Flight</button></div>
  </article>`).join("");
 window.currentFlights=flights;$("results").hidden=false;$("booking").hidden=true;$("confirmation").hidden=true;scrollToId("results");
});

$("flightResults").addEventListener("click",e=>{
 const b=e.target.closest("[data-flight-id]");if(!b)return;
 selectedFlight=(window.currentFlights||[]).find(f=>f.id===b.dataset.flightId);if(!selectedFlight)return;
 selectedSeats=[];
 $("selectedFlight").textContent=`${selectedFlight.airline}: ${selectedFlight.from} → ${selectedFlight.to}, ${selectedFlight.date}, ${selectedFlight.travelClass}`;
 $("fareSummary").textContent=`Total: ${money(fare(selectedFlight)*passengerCount)}`;
 $("seatMessage").textContent=`Select ${passengerCount} seat(s).`;
 $("booking").hidden=false;$("confirmation").hidden=true;renderSeats();scrollToId("booking");
});

function renderSeats(){
 if(!selectedFlight)return;
 const occupied=new Set(bookings().filter(b=>b.flightId===selectedFlight.id&&b.status==="Confirmed").flatMap(b=>b.seats));
 const cols=["A","B","C","D","E","F"];
 const list=[];for(let row=1;row<=Math.ceil(selectedFlight.seats/6);row++)cols.forEach(c=>list.push(`${row}${c}`));
 $("seatMap").innerHTML=list.map(s=>`<button type="button" class="seat ${selectedSeats.includes(s)?"selected":""}" data-seat="${s}" ${occupied.has(s)?"disabled":""} aria-pressed="${selectedSeats.includes(s)}">${s}</button>`).join("");
}
$("seatMap").addEventListener("click",e=>{
 const b=e.target.closest("[data-seat]");if(!b||b.disabled)return;const s=b.dataset.seat;
 if(selectedSeats.includes(s))selectedSeats=selectedSeats.filter(x=>x!==s);
 else if(selectedSeats.length<passengerCount)selectedSeats.push(s);
 else return $("seatMessage").textContent=`Select only ${passengerCount} seat(s).`;
 $("seatMessage").textContent=`Selected ${selectedSeats.length} of ${passengerCount} seat(s).`;renderSeats();
});

$("bookingForm").addEventListener("submit",e=>{
 e.preventDefault();if(!selectedFlight)return alert("Select a flight first.");
 if(selectedSeats.length!==passengerCount)return alert(`Select exactly ${passengerCount} seat(s).`);
 const name=$("passengerName").value.trim(),email=$("email").value.trim(),phone=$("phone").value.trim();
 if(!name||!email||!/^\d{10}$/.test(phone))return alert("Enter valid passenger details.");
 const all=bookings(),occupied=new Set(all.filter(b=>b.flightId===selectedFlight.id&&b.status==="Confirmed").flatMap(b=>b.seats));
 if(selectedSeats.some(s=>occupied.has(s))){alert("A seat is no longer available. Please choose again.");selectedSeats=selectedSeats.filter(s=>!occupied.has(s));renderSeats();return;}
 const r=route();
 const booking={bookingId:"SB"+Date.now().toString().slice(-9),flightId:selectedFlight.id,airline:selectedFlight.airline,from:selectedFlight.from,to:selectedFlight.to,date:selectedFlight.date,depart:selectedFlight.depart,arrive:selectedFlight.arrive,travelClass:selectedFlight.travelClass,passengerName:name,email,phone,seats:[...selectedSeats],passengers:passengerCount,totalFare:fare(selectedFlight)*passengerCount,status:"Confirmed"};
 all.push(booking);saveBookings(all);currentBooking=booking;showConfirmation(booking);renderHistory();$("booking").hidden=true;$("confirmation").hidden=false;scrollToId("confirmation");
});
function showConfirmation(b){
 $("confirmationDetails").innerHTML=`<div class="history-card"><h3>${esc(b.from)} → ${esc(b.to)}</h3><p><strong>Booking ID:</strong> ${esc(b.bookingId)}</p><p><strong>Passenger:</strong> ${esc(b.passengerName)}</p><p><strong>Airline:</strong> ${esc(b.airline)}</p><p><strong>Date:</strong> ${esc(b.date)}</p><p><strong>Departure:</strong> ${esc(b.depart)} | <strong>Arrival:</strong> ${esc(b.arrive)}</p><p><strong>Class:</strong> ${esc(b.travelClass)}</p><p><strong>Seats:</strong> ${b.seats.map(esc).join(", ")}</p><p><strong>Total:</strong> ${money(b.totalFare)}</p></div>`;
}
function renderHistory(){
 const all=bookings();$("bookingHistory").innerHTML=all.length?[...all].reverse().map(b=>`<article class="history-card"><h3>${esc(b.from)} → ${esc(b.to)}</h3><p><strong>Booking ID:</strong> ${esc(b.bookingId)}</p><p><strong>Airline:</strong> ${esc(b.airline)}</p><p><strong>Date:</strong> ${esc(b.date)}</p><p><strong>Seats:</strong> ${b.seats.map(esc).join(", ")}</p><p><strong>Class:</strong> ${esc(b.travelClass)}</p><p><strong>Total:</strong> ${money(b.totalFare)}</p><p><strong>Status:</strong> ${esc(b.status)}</p><button class="outline-btn" data-ticket-id="${esc(b.bookingId)}">Download Ticket</button></article>`).join(""):`<div class="history-card">No bookings yet. Search for a flight to get started.</div>`;
}
function downloadTicket(b){
 if(!b)return;const text=["SKYBOOK - E-TICKET","==============================",`Booking ID: ${b.bookingId}`,`Passenger: ${b.passengerName}`,`Email: ${b.email}`,`Airline: ${b.airline}`,`Flight: ${b.from} to ${b.to}`,`Date: ${b.date}`,`Departure: ${b.depart}`,`Arrival: ${b.arrive}`,`Class: ${b.travelClass}`,`Seats: ${b.seats.join(", ")}`,`Passengers: ${b.passengers}`,`Total Fare: ${money(b.totalFare)}`,`Status: ${b.status}`,"","Educational demo ticket. Not valid for travel."].join("\n");
 const url=URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=`${b.bookingId}-ticket.txt`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
$("downloadTicket").addEventListener("click",()=>downloadTicket(currentBooking));
$("bookingHistory").addEventListener("click",e=>{const b=e.target.closest("[data-ticket-id]");if(b)downloadTicket(bookings().find(x=>x.bookingId===b.dataset.ticketId))});
$("cancelBooking").addEventListener("click",()=>{$("booking").hidden=true;selectedFlight=null;selectedSeats=[];scrollToId("results")});
$("newSearch").addEventListener("click",()=>{$("confirmation").hidden=true;$("results").hidden=false;scrollToId("search")});
$("loginBtn").addEventListener("click",()=>{$("loginMessage").textContent="";$("loginDialog").showModal()});
$("closeLogin").addEventListener("click",()=>$("loginDialog").close());
$("loginForm").addEventListener("submit",e=>{e.preventDefault();const email=$("loginEmail").value.trim();$("loginBtn").textContent="Signed In";$("loginDialog").close();alert(`Demo sign-in successful for ${email}. No account was authenticated.`)});
renderHistory();
