import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Target,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  User,
  ChevronDown,
  ChevronRight,
  Star,
  Brain,
  Zap,
  CalendarDays,
} from "lucide-react";

const HomeworkAssignmentInterface = () => {
  const [selectedWeek, setSelectedWeek] = useState(12);
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);

  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState(null);

  const [aiRecommendations, setAiRecommendations] = useState({});
  const [recsLoading, setRecsLoading] = useState(true);
  const [recsError, setRecsError] = useState(null);

  // Academic year mapping - 78 weeks total
  const defaultAcademicYearMap = {
    1: {
      term: "Autumn Term 1",
      topic: "Course Introduction & Medieval Law",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 1,
    },
    2: {
      term: "Autumn Term 1",
      topic: "Medieval Law and Order",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 2,
    },
    3: {
      term: "Autumn Term 1",
      topic: "Norman Legal Changes",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 3,
    },
    4: {
      term: "Autumn Term 1",
      topic: "Trial by Ordeal and Combat",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 4,
    },
    5: {
      term: "Autumn Term 1",
      topic: "The Church and Crime",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 5,
    },
    6: {
      term: "Autumn Term 1",
      topic: "Forest Laws and Social Impact",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 6,
    },
    7: {
      term: "Autumn Term 1",
      topic: "Assessment and Review",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 7,
    },
    8: {
      term: "Autumn Term 2",
      topic: "Religious Crime and Heresy",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 8,
    },
    9: {
      term: "Autumn Term 2",
      topic: "Witchcraft and Accusations",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 9,
    },
    10: {
      term: "Autumn Term 2",
      topic: "Development of Law Enforcement",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 10,
    },
    11: {
      term: "Autumn Term 2",
      topic: "Punishment and Transportation",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 11,
    },
    12: {
      term: "Autumn Term 2",
      topic: "Introduction to Cold War Origins",
      cycleTest: "Cycle Test 2: Cold War",
      week: 12,
    },
    13: {
      term: "Autumn Term 2",
      topic: "The Grand Alliance Breakdown",
      cycleTest: "Cycle Test 2: Cold War",
      week: 13,
    },
    14: {
      term: "Autumn Term 2",
      topic: "Assessment and Review",
      cycleTest: "Cycle Test 2: Cold War",
      week: 14,
    },
    15: {
      term: "Spring Term 1",
      topic: "Truman Doctrine and Marshall Plan",
      cycleTest: "Cycle Test 2: Cold War",
      week: 15,
    },
    16: {
      term: "Spring Term 1",
      topic: "Formation of NATO and Warsaw Pact",
      cycleTest: "Cycle Test 2: Cold War",
      week: 16,
    },
    17: {
      term: "Spring Term 1",
      topic: "Berlin Blockade and Airlift",
      cycleTest: "Cycle Test 2: Cold War",
      week: 17,
    },
    18: {
      term: "Spring Term 1",
      topic: "Korean War Impact",
      cycleTest: "Cycle Test 2: Cold War",
      week: 18,
    },
    19: {
      term: "Spring Term 1",
      topic: "Arms Race Development",
      cycleTest: "Cycle Test 2: Cold War",
      week: 19,
    },
    20: {
      term: "Spring Term 1",
      topic: "Assessment and Review",
      cycleTest: "Cycle Test 2: Cold War",
      week: 20,
    },
    21: {
      term: "Spring Term 2",
      topic: "Berlin Wall Construction",
      cycleTest: "Cycle Test 2: Cold War",
      week: 21,
    },
    22: {
      term: "Spring Term 2",
      topic: "Cuban Missile Crisis - Causes",
      cycleTest: "Cycle Test 2: Cold War",
      week: 22,
    },
    23: {
      term: "Spring Term 2",
      topic: "Cuban Missile Crisis - Resolution",
      cycleTest: "Cycle Test 2: Cold War",
      week: 23,
    },
    24: {
      term: "Spring Term 2",
      topic: "Prague Spring and Soviet Response",
      cycleTest: "Cycle Test 2: Cold War",
      week: 24,
    },
    25: {
      term: "Spring Term 2",
      topic: "Détente Development",
      cycleTest: "Cycle Test 2: Cold War",
      week: 25,
    },
    26: {
      term: "Spring Term 2",
      topic: "Assessment and Review",
      cycleTest: "Cycle Test 2: Cold War",
      week: 26,
    },
    27: {
      term: "Summer Term 1",
      topic: "Reagan and the Second Cold War",
      cycleTest: "Cycle Test 2: Cold War",
      week: 27,
    },
    28: {
      term: "Summer Term 1",
      topic: "Gorbachev's Reforms",
      cycleTest: "Cycle Test 2: Cold War",
      week: 28,
    },
    29: {
      term: "Summer Term 1",
      topic: "Fall of the Berlin Wall",
      cycleTest: "Cycle Test 2: Cold War",
      week: 29,
    },
    30: {
      term: "Summer Term 1",
      topic: "Soviet Union Collapse",
      cycleTest: "Cycle Test 2: Cold War",
      week: 30,
    },
    31: {
      term: "Summer Term 1",
      topic: "Introduction to Anglo-Saxon England",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 31,
    },
    32: {
      term: "Summer Term 1",
      topic: "Assessment and Review",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 32,
    },
    33: {
      term: "Summer Term 2",
      topic: "Edward the Confessor and Succession Crisis",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 33,
    },
    34: {
      term: "Summer Term 2",
      topic: "The Claimants and Their Cases",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 34,
    },
    35: {
      term: "Summer Term 2",
      topic: "Battles of 1066",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 35,
    },
    36: {
      term: "Summer Term 2",
      topic: "Battle of Hastings",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 36,
    },
    37: {
      term: "Summer Term 2",
      topic: "Immediate Aftermath of Conquest",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 37,
    },
    38: {
      term: "Summer Term 2",
      topic: "Assessment and Review",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 38,
    },
    39: {
      term: "Summer Term 2",
      topic: "Year 10 Review and Preparation",
      cycleTest: "Course Review",
      week: 39,
    },
    40: {
      term: "Autumn Term 1",
      topic: "Establishing Control Through Castles",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 40,
    },
    41: {
      term: "Autumn Term 1",
      topic: "The Harrying of the North",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 41,
    },
    42: {
      term: "Autumn Term 1",
      topic: "Rebellions and Their Suppression",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 42,
    },
    43: {
      term: "Autumn Term 1",
      topic: "Implementation of Feudal System",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 43,
    },
    44: {
      term: "Autumn Term 1",
      topic: "The Domesday Book Project",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 44,
    },
    45: {
      term: "Autumn Term 1",
      topic: "Government and Administrative Changes",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 45,
    },
    46: {
      term: "Autumn Term 1",
      topic: "Assessment and Review",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 46,
    },
    47: {
      term: "Autumn Term 2",
      topic: "Religious Changes and Reform",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 47,
    },
    48: {
      term: "Autumn Term 2",
      topic: "Cultural and Linguistic Impact",
      cycleTest: "Cycle Test 2: Anglo-Saxon & Norman",
      week: 48,
    },
    49: {
      term: "Autumn Term 2",
      topic: "Crime and Punishment in Industrial England",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 49,
    },
    50: {
      term: "Autumn Term 2",
      topic: "Development of Bow Street Runners",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 50,
    },
    51: {
      term: "Autumn Term 2",
      topic: "Prison Reform Movement",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 51,
    },
    52: {
      term: "Autumn Term 2",
      topic: "Establishment of Professional Police",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 52,
    },
    53: {
      term: "Autumn Term 2",
      topic: "Assessment and Review",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 53,
    },
    54: {
      term: "Spring Term 1",
      topic: "Modern Crime Patterns",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 54,
    },
    55: {
      term: "Spring Term 1",
      topic: "Modern Policing Methods",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 55,
    },
    56: {
      term: "Spring Term 1",
      topic: "Rehabilitation vs Punishment Debate",
      cycleTest: "Cycle Test 1: Crime and Punishment",
      week: 56,
    },
    57: {
      term: "Spring Term 1",
      topic: "Whitechapel Social Conditions",
      cycleTest: "Cycle Test 1: Historic Environment",
      week: 57,
    },
    58: {
      term: "Spring Term 1",
      topic: "Policing Whitechapel",
      cycleTest: "Cycle Test 1: Historic Environment",
      week: 58,
    },
    59: {
      term: "Spring Term 1",
      topic: "Assessment and Review",
      cycleTest: "Cycle Test 1: Historic Environment",
      week: 59,
    },
    60: {
      term: "Spring Term 2",
      topic: "Fall of the Tsarist Regime",
      cycleTest: "Cycle Test 3: Russia and Soviet Union",
      week: 60,
    },
    61: {
      term: "Spring Term 2",
      topic: "Provisional Government Failures",
      cycleTest: "Cycle Test 3: Russia and Soviet Union",
      week: 61,
    },
    62: {
      term: "Spring Term 2",
      topic: "Lenin Return and October Revolution",
      cycleTest: "Cycle Test 3: Russia and Soviet Union",
      week: 62,
    },
    63: {
      term: "Spring Term 2",
      topic: "Civil War and War Communism",
      cycleTest: "Cycle Test 3: Russia and Soviet Union",
      week: 63,
    },
    64: {
      term: "Spring Term 2",
      topic: "Lenin Death and Succession Struggle",
      cycleTest: "Cycle Test 3: Russia and Soviet Union",
      week: 64,
    },
    65: {
      term: "Spring Term 2",
      topic: "Assessment and Review",
      cycleTest: "Cycle Test 3: Russia and Soviet Union",
      week: 65,
    },
    66: {
      term: "Summer Term 1",
      topic: "New Economic Policy",
      cycleTest: "Cycle Test 3: Russia and Soviet Union",
      week: 66,
    },
    67: {
      term: "Summer Term 1",
      topic: "Stalin Rise to Power",
      cycleTest: "Cycle Test 3: Russia and Soviet Union",
      week: 67,
    },
    68: {
      term: "Summer Term 1",
      topic: "Elimination of Political Rivals",
      cycleTest: "Cycle Test 3: Russia and Soviet Union",
      week: 68,
    },
    69: {
      term: "Summer Term 1",
      topic: "Five-Year Plans Introduction",
      cycleTest: "Cycle Test 3: Russia and Soviet Union",
      week: 69,
    },
    70: {
      term: "Summer Term 1",
      topic: "Collectivization Programme",
      cycleTest: "Cycle Test 3: Russia and Soviet Union",
      week: 70,
    },
    71: {
      term: "Summer Term 1",
      topic: "Assessment and Review",
      cycleTest: "Cycle Test 3: Russia and Soviet Union",
      week: 71,
    },
    72: {
      term: "Summer Term 2",
      topic: "The Great Terror",
      cycleTest: "Cycle Test 3: Russia and Soviet Union",
      week: 72,
    },
    73: {
      term: "Summer Term 2",
      topic: "Social and Cultural Changes",
      cycleTest: "Cycle Test 3: Russia and Soviet Union",
      week: 73,
    },
    74: {
      term: "Summer Term 2",
      topic: "Comprehensive Cycle Test 1 Review",
      cycleTest: "Exam Preparation",
      week: 74,
    },
    75: {
      term: "Summer Term 2",
      topic: "Comprehensive Cycle Test 2 Review",
      cycleTest: "Exam Preparation",
      week: 75,
    },
    76: {
      term: "Summer Term 2",
      topic: "Comprehensive Cycle Test 3 Review",
      cycleTest: "Exam Preparation",
      week: 76,
    },
    77: {
      term: "Summer Term 2",
      topic: "Final Examination Preparation",
      cycleTest: "Exam Preparation",
      week: 77,
    },
    78: {
      term: "Summer Term 2",
      topic: "Study Leave and Examinations",
      cycleTest: "GCSE Examinations",
      week: 78,
    },
  };

  const [academicYearMap, setAcademicYearMap] = useState(defaultAcademicYearMap);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarError, setCalendarError] = useState(null);

  const getCurrentWeekInfo = (week) => {
    const weekInfo = academicYearMap[week] || {};
    return {
      week: week,
      term: weekInfo.term,
      topic: weekInfo.topic,
      cycleTest: weekInfo.cycleTest,
      progress: Math.round((week / 78) * 100),
    };
  };

  const getCycleTestDescription = (cycleTest) => {
    if (cycleTest.includes("Crime and Punishment"))
      return "Thematic Study Focus";
    if (cycleTest.includes("Cold War")) return "Period Study Focus";
    if (cycleTest.includes("Anglo-Saxon & Norman"))
      return "British Depth Study Focus";
    if (cycleTest.includes("Historic Environment"))
      return "Whitechapel Case Study";
    if (cycleTest.includes("Russia and Soviet Union"))
      return "Modern Depth Study Focus";
    if (cycleTest.includes("Exam Preparation")) return "Revision and Practice";
    if (cycleTest.includes("GCSE Examinations"))
      return "Final Assessment Period";
    if (cycleTest.includes("Course Review")) return "Year 10 Consolidation";
    return "Course Content Focus";
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students");
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        setStudentsError(err.message);
      } finally {
        setStudentsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch("/api/recommendations");
        if (!res.ok) throw new Error("Failed to fetch recommendations");
        const data = await res.json();
        setAiRecommendations(data);
      } catch (err) {
        setRecsError(err.message);
      } finally {
        setRecsLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await fetch("/api/academic-calendar");
        if (!res.ok) throw new Error("Failed to fetch academic calendar");
        const data = await res.json();
        setAcademicYearMap(data);
      } catch (err) {
        setCalendarError(err.message);
      } finally {
        setCalendarLoading(false);
      }
    };
    fetchCalendar();
  }, []);

  if (studentsLoading || recsLoading || calendarLoading) {
    return <div>Loading...</div>;
  }

  if (studentsError || recsError || calendarError) {
    return <div>Error loading data</div>;
  }

  const currentWeek = getCurrentWeekInfo(selectedWeek);


  const getAbilityColor = (ability) => {
    switch (ability) {
      case "stretch":
        return "text-purple-600 bg-purple-50";
      case "on-track":
        return "text-blue-600 bg-blue-50";
      case "supporting":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getQuartileColor = (quartile) => {
    switch (quartile) {
      case "Q4":
        return "text-green-700 bg-green-100";
      case "Q3":
        return "text-blue-700 bg-blue-100";
      case "Q2":
        return "text-yellow-700 bg-yellow-100";
      case "Q1":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getAbilityIcon = (ability) => {
    switch (ability) {
      case "stretch":
        return <Star className="w-4 h-4" />;
      case "on-track":
        return <Target className="w-4 h-4" />;
      case "supporting":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Advanced":
        return "text-red-600 bg-red-50";
      case "Standard":
        return "text-yellow-600 bg-yellow-50";
      case "Foundation":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleAssignmentToggle = (assignmentId) => {
    setSelectedAssignments((prev) =>
      prev.includes(assignmentId)
        ? prev.filter((id) => id !== assignmentId)
        : [...prev, assignmentId]
    );
  };

  const getRecommendationsForStudent = (studentId) => {
    if (studentId === "all") {
      return {
        stretch: aiRecommendations.stretch,
        "on-track": aiRecommendations["on-track"],
        supporting: aiRecommendations.supporting,
      };
    }

    const student = students.find((s) => s.id === studentId);
    if (!student) return {};

    return {
      [student.ability]: aiRecommendations[student.ability] || [],
    };
  };

  const handleStudentClick = (student) => {
    if (student.rationale) {
      setSelectedStudentForModal(student);
      setShowStudentModal(true);
    } else {
      setSelectedStudent(student.id);
    }
  };

  const assignHomework = () => {
    setShowAssignmentModal(true);
    setCurrentStep(1);
  };

  const confirmAssignment = () => {
    setCurrentStep(2);
    setTimeout(() => {
      setCurrentStep(3);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Homework Assignment
          </h1>
          <p className="text-gray-600">
            Assign targeted homework based on learner ability and curriculum
            progress
          </p>
        </div>

        {/* Current Progress Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Current Academic Position
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Week {currentWeek.week} of 78</span>
              </div>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Change Week</span>
              </button>
            </div>
          </div>

          {/* Date Picker */}
          {showDatePicker && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Select Academic Week
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[...Array(78)].map((_, index) => {
                  const week = index + 1;
                  const weekInfo = academicYearMap[week];
                  return (
                    <button
                      key={week}
                      onClick={() => {
                        setSelectedWeek(week);
                        setShowDatePicker(false);
                      }}
                      className={`p-2 text-xs rounded border transition-colors duration-200 ${
                        selectedWeek === week
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                      title={`${weekInfo.term}: ${weekInfo.topic}`}
                    >
                      Week {week}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {currentWeek.term}
                </span>
              </div>
              <p className="text-sm text-blue-700">{currentWeek.topic}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">
                  {currentWeek.cycleTest}
                </span>
              </div>
              <p className="text-sm text-green-700">
                {getCycleTestDescription(currentWeek.cycleTest)}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">
                  Progress: {currentWeek.progress}%
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentWeek.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Students
              </h3>

              <div className="space-y-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedStudent === student.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    } ${student.rationale ? "hover:shadow-md" : ""}`}
                    onClick={() =>
                      student.rationale
                        ? handleStudentClick(student)
                        : setSelectedStudent(student.id)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {student.type === "group" ? (
                          <Users className="w-5 h-5 text-gray-600" />
                        ) : (
                          <div className="relative">
                            <User className="w-5 h-5 text-gray-600" />
                            {student.rationale && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">
                              {student.name}
                            </p>
                            {student.rationale && (
                              <span className="text-xs text-blue-600 font-medium">
                                View Profile
                              </span>
                            )}
                          </div>
                          {student.ability && (
                            <div className="flex items-center space-x-1 mt-1">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getAbilityColor(
                                  student.ability
                                )}`}
                              >
                                {getAbilityIcon(student.ability)}
                                <span className="ml-1">{student.ability}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {student.quartile && (
                        <div className="text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getQuartileColor(
                              student.quartile
                            )}`}
                          >
                            {student.quartile}
                          </span>
                          <div
                            className={`text-xs mt-1 ${
                              student.trend === "up"
                                ? "text-green-600"
                                : student.trend === "down"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {student.trend === "up"
                              ? "↗"
                              : student.trend === "down"
                              ? "↘"
                              : "→"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  AI Homework Recommendations
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Brain className="w-4 h-4" />
                  <span>Powered by AI</span>
                </div>
              </div>

              {Object.entries(
                getRecommendationsForStudent(selectedStudent)
              ).map(([ability, assignments]) => (
                <div key={ability} className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getAbilityColor(
                        ability
                      )}`}
                    >
                      {getAbilityIcon(ability)}
                      <span className="ml-1 capitalize">
                        {ability.replace("-", " ")}
                      </span>
                    </span>
                    <span className="text-sm text-gray-500">
                      {assignments.length} recommendation
                      {assignments.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className={`border rounded-lg p-4 transition-all duration-200 ${
                          selectedAssignments.includes(assignment.id)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <input
                                type="checkbox"
                                className="w-5 h-5 text-blue-600 rounded border-gray-300"
                                checked={selectedAssignments.includes(
                                  assignment.id
                                )}
                                onChange={() =>
                                  handleAssignmentToggle(assignment.id)
                                }
                              />
                              <h4 className="font-medium text-gray-900">
                                {assignment.title}
                              </h4>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 ml-8">
                              {assignment.description}
                            </p>

                            <div className="flex flex-wrap gap-2 ml-8">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {assignment.type}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {assignment.duration}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                  assignment.difficulty
                                )}`}
                              >
                                {assignment.difficulty}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              setExpandedAssignment(
                                expandedAssignment === assignment.id
                                  ? null
                                  : assignment.id
                              )
                            }
                            className="ml-4 p-1 text-gray-400 hover:text-gray-600"
                          >
                            {expandedAssignment === assignment.id ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        {expandedAssignment === assignment.id && (
                          <div className="mt-4 ml-8 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">
                                  Skills Developed
                                </h5>
                                <div className="flex flex-wrap gap-1">
                                  {assignment.skills.map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">
                                  Resources
                                </h5>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {assignment.resources.map(
                                    (resource, index) => (
                                      <li key={index}>• {resource}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>

                            <div className="mt-4">
                              <h5 className="font-medium text-gray-900 mb-2">
                                AI Reasoning
                              </h5>
                              <p className="text-sm text-gray-600 italic">
                                {assignment.aiReasoning}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Assignment Actions */}
        {selectedAssignments.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {selectedAssignments.length} assignment
                {selectedAssignments.length !== 1 ? "s" : ""} selected
              </div>
              <button
                onClick={assignHomework}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Assign Homework</span>
              </button>
            </div>
          </div>
        )}

        {/* Student Profile Modal */}
        {showStudentModal && selectedStudentForModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedStudentForModal.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getAbilityColor(
                          selectedStudentForModal.ability
                        )}`}
                      >
                        {getAbilityIcon(selectedStudentForModal.ability)}
                        <span className="ml-1 capitalize">
                          {selectedStudentForModal.ability.replace("-", " ")}
                        </span>
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getQuartileColor(
                          selectedStudentForModal.quartile
                        )}`}
                      >
                        {selectedStudentForModal.quartile}
                      </span>
                      <span
                        className={`text-xs ${
                          selectedStudentForModal.trend === "up"
                            ? "text-green-600"
                            : selectedStudentForModal.trend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {selectedStudentForModal.trend === "up"
                          ? "↗ Improving"
                          : selectedStudentForModal.trend === "down"
                          ? "↘ Declining"
                          : "→ Stable"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Performance Summary
                  </h4>
                  <p className="text-blue-800 text-sm">
                    {selectedStudentForModal.rationale.summary}
                  </p>
                </div>

                {/* Strengths */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Key Strengths
                  </h4>
                  <ul className="space-y-2">
                    {selectedStudentForModal.rationale.strengths.map(
                      (strength, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-2 text-sm text-gray-700"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Areas for Development */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    Areas for Development
                  </h4>
                  <ul className="space-y-2">
                    {selectedStudentForModal.rationale.areasForDevelopment.map(
                      (area, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-2 text-sm text-gray-700"
                        >
                          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>{area}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Recent Performance */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Recent Assessment Performance
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedStudentForModal.rationale.recentPerformance.map(
                      (performance, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900">
                            {performance}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Teaching Recommendation
                  </h4>
                  <p className="text-yellow-800 text-sm">
                    {selectedStudentForModal.rationale.recommendation}
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowStudentModal(false);
                    setSelectedStudent(selectedStudentForModal.id);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Assign Homework to {selectedStudentForModal.name}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assignment Modal */}
        {showAssignmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              {currentStep === 1 && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Confirm Assignment
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You are about to assign {selectedAssignments.length}{" "}
                    homework task{selectedAssignments.length !== 1 ? "s" : ""}{" "}
                    to{" "}
                    {selectedStudent === "all"
                      ? "all students"
                      : students.find((s) => s.id === selectedStudent)?.name}
                    .
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowAssignmentModal(false)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmAssignment}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Confirm
                    </button>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Assigning Homework...
                  </h3>
                  <p className="text-gray-600">
                    Creating personalized assignments and notifications
                  </p>
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Assignment Complete!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Homework has been successfully assigned. Students will
                    receive notifications and access to all resources.
                  </p>
                  <button
                    onClick={() => {
                      setShowAssignmentModal(false);
                      setSelectedAssignments([]);
                      setCurrentStep(1);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeworkAssignmentInterface;
