document.addEventListener("DOMContentLoaded", () => {
  const time = new Date();
  const todaysDate = time.toDateString();
  const container = document.querySelector(".container");

  const addTaskButton = document.querySelector(".task__addtask");

  const modal = document.querySelector(".modal");
  const modalTitle = modal.querySelector(".modal__Heading");

  const taskHeading = document.querySelector(".task__heading");
  const todaysDayEle = document.querySelector(".task__todaysDate");
  todaysDayEle.textContent = todaysDate;

  const hourlytasksWrapper = document.getElementById("taskList");

  const taskTabs = document.querySelector(".task__tabsList");
  const taskEffortsWrapper = document.querySelector(".tasks__efforts");

  const totalHours = 24;
  const startHour = 10;
  const endHour = 23;
  const allTodaysTask = [];

  if (window.innerWidth <= 1023) {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("light");
  }
  function setActiveTask(ID) {
    localStorage.setItem("TodaysTaskManagerActive", ID);
    activeTaskTab = ID;
    setTimeout(() => {
      updateEndTime(activeTaskTab);
    }, 1000);
  }

  function getActiveTask() {
    let activeNumber = localStorage.getItem("TodaysTaskManagerActive")
      ? localStorage.getItem("TodaysTaskManagerActive")
      : -1;
    setActiveTask(activeNumber);
    return parseInt(activeNumber);
  }
  var activeTaskTab = getActiveTask();
  function toggleNavbar() {
    taskHeading.classList.toggle("bottom-nav");
  }
  function toggleColorMode() {
    console.log("toggle color");
    document.documentElement.classList.toggle("dark");
    document.documentElement.classList.toggle("light");
  }
  todaysDayEle.addEventListener("click", () => {
    if (window.innerWidth > 1023) {
      toggleColorMode();
    } else toggleNavbar();
  });
  function openModal(e, operation) {
    // let selectedHour = parseInt(e.target.parentNode.dataset.hour);
    container.classList.add("--hide");
    modal.classList.add("--show");
    // modalTitle.textContent = `Add Task for ${selectedHour} to ${
    //   selectedHour + 1
    // }`;
  }
  function closeModal() {
    container.classList.remove("--hide");
    modal.classList.remove("--show");
  }
  modal.addEventListener("click", (e) => {
    e.target.classList.contains("modal") && closeModal();
  });
  // Append Hours to Task List
  function addHours() {
    for (let i = startHour; i <= endHour; i++) {
      // Container of this hour
      const hourTask = document.createElement("div");
      hourTask.classList.add("task__hour");
      hourTask.dataset.hour = i;
      // Hour
      const hour = document.createElement("span");
      hour.textContent = (i > 12 ? i : i) + (i >= 13 ? "pm" : "am");
      hourTask.appendChild(hour);
      // TaskList of this hour
      const hourTaskList = document.createElement("div");
      hourTaskList.classList.add("task__hourtaskList");

      hourTask.appendChild(hourTaskList);
      hourlytasksWrapper.appendChild(hourTask);
      allTodaysTask.push(hourTask);
    }
  }

  function getCurrentHour() {
    // if (time.getHours() > endHour) {
    const currentHour = document.querySelector(
      `[data-hour="${time.getHours()}"]`
    );
    const currentCursor = document.createElement("div");
    currentCursor.classList.add("time__nowCursor");
    currentHour.appendChild(currentCursor);
    return [currentHour, currentCursor];
    // }
  }

  function updateCursor(cursorEle) {
    cursorEle.style.top = (time.getMinutes() * 100) / 60 + "%";
    return cursorEle;
  }

  addHours();
  let currentActiveTask = getCurrentHour();
  updateCursor(currentActiveTask[1]);

  let currentY = 0;
  window.addEventListener("scroll", () => {
    if (currentY > window.scrollY) {
      taskHeading.classList.remove("--hide");
      currentY = window.scrollY;
    } else {
      taskHeading.classList.add("--hide");
      currentY = window.scrollY;
    }
  });

  addTaskButton.addEventListener("click", (e) => {
    openModal(e, "add");
  });

  /*------ Storing data ------*/
  var tasksList = new Array();
  const currentDate = new Date();

  const getTimeForHours = (hours) => {
    const date = new Date(currentDate);
    date.setHours(hours, 0, 0, 0);
    return date.getTime();
  };

  var listOfTasks = [
    {
      date: todaysDate,
      totalNumberOfTasks: 2,
      tasks: [
        // {
        //   taskName: "leisure",
        //   taskColor: "none",
        //   time: [
        //     {
        //       start: "2024-03-02T06:00:11.658Z",
        //       end: "2024-03-02T07:00:11.658Z",
        //     },
        //   ],
        //   taskEfforts: 1,
        // },
      ],
    },
  ];

  var todaysTaskData;
  todaysTaskData = getTodaysTask(todaysDate);

  function storeTasks(tasks, reload = 0) {
    const dataToStore = JSON.stringify(tasks);
    localStorage.removeItem("TodaysTaskManager");
    localStorage.setItem("TodaysTaskManager", dataToStore);
    if (reload == 1) {
      console.log("New Day");
      window.reload;
    } else addTasksToTabs(todaysTaskData);
  }
  addTasksToTabs(todaysTaskData);

  function getTodaysTask(dateForTask) {
    let dataGot;
    if (
      localStorage.getItem("TodaysTaskManager") == null ||
      localStorage.getItem("TodaysTaskManager").length <= 0
    ) {
      dataGot = listOfTasks;
    } else {
      dataGot = JSON.parse(localStorage.getItem("TodaysTaskManager"));
    }
    listOfTasks = dataGot;
    let dataToFind;

    dataGot.map((dateData, i) => {
      newFunction();

      function newFunction() {
        if (dataGot[i].date.toString() == dateForTask) {
          dataToFind = dateData;
        }
      }
    });
    if (!dataToFind) {
      setActiveTask("-1");
      let newtodaysTask = {
        date: todaysDate,
        totalNumberOfTasks: 0,
        tasks: [],
      };
      dataGot.push(newtodaysTask);
      storeTasks(dataGot, 1);
      dataGot.map((dateData, i) => {
        newFunction();

        function newFunction() {
          if (dataGot[i].date.toString() == dateForTask) {
            dataToFind = dateData;
          }
        }
      });
    }

    return dataToFind;
  }

  function setTodaysTask(taskData) {
    let dataUpdated = listOfTasks.map((dateData, i) => {
      if (listOfTasks[i].date.toString() == taskData.date.toString()) {
        // console.log(listOfTasks[i], taskData);
        listOfTasks[i] = taskData;
      }
    });
    storeTasks(listOfTasks);
    return listOfTasks;
  }
  /*------ Add Todays Tasks tab ------*/
  // console.log(todaysTaskData.tasks);

  function addTasksToTabs(tasksData) {
    // console.log("tasksData", tasksData);

    taskTabs.querySelectorAll(".task__tab").forEach((tab) => {
      if (!tab.classList.contains("--users-task")) tab.remove();
    });

    tasksData.tasks.forEach((task, i) => {
      tasksList.push(task);
      let tabElement = document.createElement("button");
      tabElement.classList.add("task__tab");
      tabElement.dataset.task = task.taskName;
      tabElement.dataset.color = task.taskColor;
      tabElement.dataset.taskId = i;
      tabElement.textContent = task.taskName;
      taskTabs.appendChild(tabElement);
    });
    intializeTabs();
  }

  /*------ Tabs ------*/
  function intializeTabs() {
    taskTabs.querySelectorAll(".task__tab").forEach((tab) => {
      if (tab.dataset.taskId == activeTaskTab) tab.classList.add("active");
      tab.addEventListener("click", (e) => {
        // console.log(e.currentTarget);
        if (!e.currentTarget.classList.contains("active")) {
          updateEndTime(activeTaskTab);
          let task = e.currentTarget;
          let taskId = task.dataset.taskId;
          setActiveTask(taskId);
          activateTab(e);
          setTodaysTask(todaysTaskData);
          // console.log(e.currentTarget);
        }
      });
    });
  }

  function activateTab(e) {
    let tab = e.currentTarget;
    taskTabs.querySelectorAll(".task__tab").forEach((tab) => {
      tab.classList.contains("active") && tab.classList.remove("active");
    });
    tab.classList.add("active");
    updateStartTime(e);
  }

  function updateStartTime(e) {
    let tab = e.currentTarget.dataset.taskId;
    let startTime = new Date().getTime();
    let newstartedTime = { start: startTime, end: startTime };
    if (tab != -1) {
      todaysTaskData.tasks[tab].time.push({ ...newstartedTime });
      // todaysTaskData.tasks[tab].time = newstartedTime;
    }
    // console.log(todaysTaskData);
    setTodaysTask(todaysTaskData);
  }

  function updateEndTime(taskId) {
    let endTime = new Date().getTime();
    if (todaysTaskData.tasks[activeTaskTab] || activeTaskTab != -1) {
      if (todaysTaskData.tasks[activeTaskTab].time.length != 0) {
        let newTime = (todaysTaskData.tasks[activeTaskTab].time[
          todaysTaskData.tasks[activeTaskTab].time.length - 1
        ].end = endTime);
        // setTodaysTask(todaysTaskData);
      }
    }
  }
  /*------ Occupied Time ------*/
  const onetaskHourEle = document.querySelector(".task__hour").offsetHeight;
  tasksList.forEach((task) => {
    let totalHoursSpent = new Number();
    totalHoursSpent = 0.0;
    task.time.forEach((timeBreak) => {
      totalHoursSpent += addOccupiedTimeBar(
        timeBreak.start,
        timeBreak.end,
        task.taskColor
      );
    });
    task.taskEfforts = totalHoursSpent;
    addTaskEffortData(task.taskName, totalHoursSpent);
    // console.log(task.taskName, totalHoursSpent);
    storeTasks(listOfTasks);
  });

  function addOccupiedTimeBar(start, end, color) {
    var occupiedTimeEle = document.createElement("div");
    occupiedTimeEle.className = "task__occupied";
    occupiedTimeEle.dataset.color = color;

    let startHour = new Date(start).getHours();
    let startMinutes = new Date(start).getMinutes();
    let endHour = new Date(end).getHours();
    let endMinutes = new Date(end).getMinutes();
    let startTotalMinutes = startHour * 60 + startMinutes;
    let endTotalMinutes = endHour * 60 + endMinutes;

    let top = ((startTotalMinutes - 10 * 60) * onetaskHourEle) / 60;
    let totalTime = (endTotalMinutes - startTotalMinutes) / 60;

    occupiedTimeEle.style.top = "calc(" + top + "px" + "  )";
    // (time.getMinutes() * 100) / 60 + "%"
    occupiedTimeEle.style.height = totalTime * onetaskHourEle + "px";

    hourlytasksWrapper.appendChild(occupiedTimeEle);
    return totalTime;
  }

  /*------ Add new tasks ------*/
  const addtaskForm = document.getElementById("addNewTask");
  const formTextInput = document.getElementById("taskName");
  const formColorInput = document.getElementById("taskColor");

  function addNewTask(name, color) {
    let newTask = {
      taskName: name,
      taskColor: color,
      time: [],
      taskEfforts: 0,
    };
    todaysTaskData.tasks.push(newTask);
    todaysTaskData.totalNumberOfTasks = todaysTaskData.tasks.length;
    setTodaysTask(todaysTaskData);
  }

  addtaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewTask(formTextInput.value, formColorInput.value);
    addtaskForm.reset();
    closeModal();
  });

  function addTaskEffortData(task, efforts) {
    let taskEffortEle = document.createElement("p");
    taskEffortEle.dataset.taskName = task;
    taskEffortEle.dataset.taskEfforts = efforts;
    taskEffortEle.textContent = `${task}: ${efforts.toFixed(2)}hrs`;
    taskEffortsWrapper.appendChild(taskEffortEle);
  }
  /*------ Loop ------*/
  setInterval(() => {
    updateCursor(currentActiveTask[1]);
    updateEndTime(activeTaskTab);
    setTodaysTask(todaysTaskData);
  }, 60000);
});
