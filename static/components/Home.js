export default {
    template: `
    <div class="text-center">
        <img src="static/bg.jpg" alt="Home"
           style="
            width: 80vw;
            object-fit: cover;
            z-index: 1;
           ">
       
       <div 
       style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -10%);
            z-index: 2;
            background: rgba(0, 0, 0, 0.5);
            padding: 20px;
            border-radius: 10px;
           " 
        class="text-center text-white"
       >
           <h4>Welcome to </h4>
           <h1 class="m-5" style="font-size:70px">Quiz-Master</h1>
       </div>
    </div>`
}
