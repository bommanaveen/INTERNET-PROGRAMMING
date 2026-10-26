const $ = id => document.getElementById(id);
const baseHotels = [
 {id:"H101",name:"Palm Grove Hotel",city:"Chennai",type:"Standard",price:2800,rooms:12,rating:4.4,amenities:["Wi-Fi","Breakfast","Parking"],description:"A welcoming stay close to the city."},
 {id:"H102",name:"The Azure Suites",city:"Chennai",type:"Deluxe",price:4600,rooms:8,rating:4.7,amenities:["Wi-Fi","Pool","Restaurant"],description:"Modern rooms with premium comfort."},
 {id:"H201",name:"Garden View Inn",city:"Bengaluru",type:"Standard",price:3200,rooms:10,rating:4.2,amenities:["Wi-Fi","Breakfast","Garden"],description:"A calm retreat for work or leisure."},
 {id:"H202",name:"Skyline Grand",city:"Bengaluru",type:"Suite",price:7800,rooms:5,rating:4.8,amenities:["Wi-Fi","Pool","Spa","Restaurant"],description:"Spacious suites with city views."},
 {id:"H301",name:"Harbour Lights",city:"Mumbai",type:"Deluxe",price:5900,rooms:9,rating:4.5,amenities:["Wi-Fi","Restaurant","Sea view"],description:"Comfortable rooms near the waterfront."},
 {id:"H401",name:"Capital Comfort",city:"Delhi",type:"Standard",price:3000,rooms:14,rating:4.1,amenities:["Wi-Fi","Breakfast","Parking"],description:"Convenient access to local attractions."},
 {id:"H501",name:"Deccan Residency",city:"Hyderabad",type:"Deluxe",price:4200,rooms:7,rating:4.3,amenities:["Wi-Fi","Pool","Restaurant"],description:"Relaxed hospitality in the city."},
 {id:"H601",name:"Coastal Escape",city:"Goa",type:"Suite",price:8500,rooms:6,rating:4.9,amenities:["Wi-Fi","Pool","Beach access","Breakfast"],description:"A relaxing stay near the beach."},
 {id:"H701",name:"Backwater Haven",city:"Kochi",type:"Standard",price:3500,rooms:11,rating:4.4,amenities:["Wi-Fi","Breakfast","Garden"],description:"A comfortable base to explore Kerala."}
];
const todayDate = new Date();
const dateString = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const today = dateString(todayDate);
$("checkIn").min=today;$("checkIn").value=today;
const tomorrow=new Date(todayDate);tomorrow.setDate(tomorrow.getDate()+1);
$("checkOut").min=dateString(tomorrow);$("checkOut").value=dateString(tomorrow);
let currentResults=[],selectedHotel=null,currentBooking=null,search={destination:"Chennai",checkIn:today,checkOut:dateString(tomorrow),guests:2,roomType:"Any"};

function readStore(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function getBookings(){const x=readStore("stayeaseBookings",[]);return Array.isArray(x)?x:[]}
function saveBookings(x){localStorage.setItem("stayeaseBookings",JSON.stringify(x))}
function getCustomHotels(){const x=readStore("stayeaseCustomHotels",[]);return Array.isArray(x)?x:[]}
function getHotels(){return [...baseHotels,...getCustomHotels()]}
function getReviews(){const x=readStore("stayeaseReviews",[]);return Array.isArray(x)?x:[]}
function money(n){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n)}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function nights(){return Math.round((new Date(search.checkOut+"T12:00:00")-new Date(search.checkIn+"T12:00:00"))/86400000)}
function scrollToId(id){$(id).scrollIntoView({behavior:"smooth",block:"start"})}
function occupiedRooms(hotelId,checkIn,checkOut){return getBookings().filter(b=>b.hotelId===hotelId&&b.status==="Confirmed"&&b.checkIn<checkOut&&b.checkOut>checkIn).reduce((sum,b)=>sum+b.rooms,0)}
function hotelRating(hotel){const reviews=getReviews().filter(r=>r.hotelId===hotel.id);if(!reviews.length)return hotel.rating;return reviews.reduce((a,r)=>a+r.rating,0)/reviews.length}
function fillReviewHotels(){const hotels=getHotels();$("reviewHotel").innerHTML=hotels.map(h=>`<option value="${esc(h.id)}">${esc(h.name)} — ${esc(h.city)}</option>`).join("")}
$("checkIn").addEventListener("change",()=>{const min=new Date($("checkIn").value+"T12:00:00");min.setDate(min.getDate()+1);$("checkOut").min=dateString(min);if($("checkOut").value<dateString(min))$("checkOut").value=dateString(min)});

$("searchForm").addEventListener("submit",e=>{
 e.preventDefault();search={destination:$("destination").value,checkIn:$("checkIn").value,checkOut:$("checkOut").value,guests:Number($("guests").value),roomType:$("roomType").value};
 if(search.checkIn<today)return alert("Choose today or a future check-in date.");
 if(search.checkOut<=search.checkIn)return alert("Check-out must be after check-in.");
 currentResults=getHotels().filter(h=>h.city===search.destination&&(search.roomType==="Any"||h.type===search.roomType)).map(h=>({...h,available:Math.max(0,h.rooms-occupiedRooms(h.id,search.checkIn,search.checkOut))})).filter(h=>h.available>0);
 $("searchSummary").textContent=`${search.destination} | ${search.checkIn} to ${search.checkOut} | ${nights()} night(s) | ${search.guests} guest(s)`;
 $("hotelResults").innerHTML=currentResults.length?currentResults.map(h=>`
  <article class="hotel-card"><div class="hotel-art">🏨</div><div class="hotel-content"><h3>${esc(h.name)}</h3><p class="hotel-meta">${esc(h.city)} · ${esc(h.type)} room</p><p class="rating">★ ${hotelRating(h).toFixed(1)} <span class="muted">(${getReviews().filter(r=>r.hotelId===h.id).length} guest reviews)</span></p><p>${esc(h.description)}</p><div class="amenities">${h.amenities.map(a=>`<span class="amenity">${esc(a)}</span>`).join("")}</div><p class="muted">${h.available} room(s) available for your dates</p><div class="hotel-bottom"><div class="price">${money(h.price)}<small>per room / night</small></div><button class="primary-btn" data-hotel="${esc(h.id)}">Book Room</button></div></div></article>`).join(""):`<div class="history-card">No matching hotels with rooms available for these dates. Try a different destination or room type.</div>`;
 $("results").hidden=false;$("booking").hidden=true;$("confirmation").hidden=true;scrollToId("results");
});

$("hotelResults").addEventListener("click",e=>{
 const btn=e.target.closest("[data-hotel]");if(!btn)return;
 selectedHotel=currentResults.find(h=>h.id===btn.dataset.hotel);if(!selectedHotel)return;
 $("selectedHotel").textContent=`${selectedHotel.name} · ${selectedHotel.city} · ${selectedHotel.type} · ${search.checkIn} to ${search.checkOut}`;
 $("roomCount").value="1";updatePrice();$("booking").hidden=false;$("confirmation").hidden=true;scrollToId("booking");
});
function updatePrice(){if(!selectedHotel)return;const rooms=Number($("roomCount").value);$("priceSummary").textContent=`${nights()} night(s) × ${rooms} room(s) × ${money(selectedHotel.price)} = ${money(nights()*rooms*selectedHotel.price)}`}
$("roomCount").addEventListener("change",updatePrice);

$("bookingForm").addEventListener("submit",e=>{
 e.preventDefault();if(!selectedHotel)return alert("Select a hotel first.");
 const guestName=$("guestName").value.trim(),email=$("email").value.trim(),phone=$("phone").value.trim(),rooms=Number($("roomCount").value);
 if(!guestName||!email||!/^\d{10}$/.test(phone))return alert("Enter valid guest details.");
 const all=getBookings(),occupied=occupiedRooms(selectedHotel.id,search.checkIn,search.checkOut);
 if(selectedHotel.rooms-occupied<rooms)return alert("Not enough rooms remain available for these dates. Search again.");
 const booking={bookingId:"ST"+Date.now().toString().slice(-9),hotelId:selectedHotel.id,hotelName:selectedHotel.name,city:selectedHotel.city,roomType:selectedHotel.type,checkIn:search.checkIn,checkOut:search.checkOut,nights:nights(),guests:search.guests,rooms,guestName,email,phone,specialRequest:$("specialRequest").value.trim(),total:rooms*nights()*selectedHotel.price,status:"Confirmed"};
 all.push(booking);saveBookings(all);currentBooking=booking;showConfirmation(booking);renderHistory();$("booking").hidden=true;$("confirmation").hidden=false;scrollToId("confirmation");
});
function showConfirmation(b){$("confirmationDetails").innerHTML=`<div class="history-card"><h3>${esc(b.hotelName)}</h3><p><strong>Booking ID:</strong> ${esc(b.bookingId)}</p><p><strong>Guest:</strong> ${esc(b.guestName)}</p><p><strong>Destination:</strong> ${esc(b.city)}</p><p><strong>Check-in:</strong> ${esc(b.checkIn)} | <strong>Check-out:</strong> ${esc(b.checkOut)}</p><p><strong>Room type:</strong> ${esc(b.roomType)} | <strong>Rooms:</strong> ${b.rooms}</p><p><strong>Guests:</strong> ${b.guests}</p><p><strong>Total:</strong> ${money(b.total)}</p><p><strong>Status:</strong> ${esc(b.status)}</p></div>`}
function renderHistory(){const all=getBookings();$("bookingHistory").innerHTML=all.length?[...all].reverse().map(b=>`<article class="history-card"><h3>${esc(b.hotelName)} — ${esc(b.city)}</h3><p><strong>Booking ID:</strong> ${esc(b.bookingId)}</p><p><strong>Guest:</strong> ${esc(b.guestName)}</p><p><strong>Dates:</strong> ${esc(b.checkIn)} to ${esc(b.checkOut)}</p><p><strong>Rooms:</strong> ${b.rooms} · <strong>Guests:</strong> ${b.guests}</p><p><strong>Total:</strong> ${money(b.total)}</p><p><strong>Status:</strong> ${esc(b.status)}</p><button class="outline-btn" data-print="${esc(b.bookingId)}">Print Confirmation</button></article>`).join(""):`<div class="history-card">No bookings yet. Search for a hotel to get started.</div>`}
$("printBooking").addEventListener("click",()=>{if(currentBooking)window.print()});
$("bookingHistory").addEventListener("click",e=>{const btn=e.target.closest("[data-print]");if(!btn)return;currentBooking=getBookings().find(b=>b.bookingId===btn.dataset.print);if(currentBooking){showConfirmation(currentBooking);$("confirmation").hidden=false;window.print()}});
$("cancelBooking").addEventListener("click",()=>{$("booking").hidden=true;selectedHotel=null;scrollToId("results")});
$("newSearch").addEventListener("click",()=>{$("confirmation").hidden=true;$("results").hidden=false;scrollToId("search")});

$("reviewForm").addEventListener("submit",e=>{
 e.preventDefault();const hotelId=$("reviewHotel").value,hotel=getHotels().find(h=>h.id===hotelId);if(!hotel)return;
 const reviews=getReviews();reviews.push({id:"RV"+Date.now(),hotelId,hotelName:hotel.name,name:$("reviewName").value.trim(),rating:Number($("rating").value),text:$("reviewText").value.trim()});localStorage.setItem("stayeaseReviews",JSON.stringify(reviews));$("reviewForm").reset();renderReviews();if(!$("results").hidden){$("searchForm").requestSubmit()}alert("Review saved in this browser.");
});
function renderReviews(){const reviews=getReviews();$("reviewList").innerHTML=reviews.length?reviews.slice().reverse().map(r=>`<article class="review-card"><strong>${esc(r.hotelName)}</strong><p class="stars">${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</p><p>${esc(r.text)}</p><p class="muted">By ${esc(r.name)}</p></article>`).join(""):`<p class="muted">No reviews yet. Be the first to share your experience.</p>`}

$("adminForm").addEventListener("submit",e=>{
 e.preventDefault();const hotel={id:"HC"+Date.now(),name:$("adminHotelName").value.trim(),city:$("adminCity").value,type:$("adminRoomType").value,price:Number($("adminPrice").value),rooms:Number($("adminRooms").value),rating:0,amenities:$("adminAmenities").value.split(",").map(x=>x.trim()).filter(Boolean),description:$("adminDescription").value.trim()};
 if(!hotel.name||hotel.price<500||hotel.rooms<0||!hotel.amenities.length)return alert("Please check hotel listing details.");
 const custom=getCustomHotels();custom.push(hotel);localStorage.setItem("stayeaseCustomHotels",JSON.stringify(custom));$("adminForm").reset();renderAdmin();fillReviewHotels();alert("Hotel listing added to this browser.");
});
function renderAdmin(){const hotels=getHotels();$("adminHotelList").innerHTML=hotels.map(h=>`<article class="history-card"><h3>${esc(h.name)}</h3><p>${esc(h.city)} · ${esc(h.type)}</p><p>Price: ${money(h.price)} per night · Rooms: ${h.rooms}</p><p class="muted">${h.amenities.map(esc).join(", ")}</p></article>`).join("")}

$("loginBtn").addEventListener("click",()=>$("loginDialog").showModal());
$("closeLogin").addEventListener("click",()=>$("loginDialog").close());
$("loginForm").addEventListener("submit",e=>{e.preventDefault();const email=$("loginEmail").value.trim();$("loginDialog").close();$("loginBtn").textContent="Signed In";alert(`Demo sign-in for ${email}. No account was authenticated.`)});
fillReviewHotels();renderHistory();renderReviews();renderAdmin();
