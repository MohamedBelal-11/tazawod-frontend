export type StudentNoteAdmin =
  | {
      written: true;
      teacher: { name: string; id: string };
      rate: number;
      description: string;
      date: string;
    }
  | {
      written: false;
      teacher: { name: string; id: string };
      date: string;
    };

export type StudentNoteSelf =
  | {
      written: true;
      teacher: string;
      rate: number;
      description: string;
      date: string;
    }
  | {
      written: false;
      teacher: string;
      date: string;
    };

export type TeacherNoteAdmin =
  | {
      written: true;
      student: { name: string; id: string };
      rate: number;
      description: string;
      date: string;
    }
  | {
      written: false;
      student: { name: string; id: string };
      date: string;
    };

export type TeacherNoteSelf =
  | {
      written: true;
      student: string;
      rate: number;
      description: string;
      date: string;
    }
  | {
      written: false;
      student: string;
      date: string;
    };
