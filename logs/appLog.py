import tkinter as tk
from tkinter import ttk
from datetime import datetime

class LogViewerApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Log Viewer")
        
        # Create mode selection buttons
        self.mode_frame = ttk.Frame(self.root)
        self.mode_frame.pack(pady=10)
        
        self.integrated_button = ttk.Button(self.mode_frame, text="整合檢視", command=lambda: self.load_and_display_logs("integrated"))
        self.integrated_button.pack(side="left", padx=10)
        
        self.separate_button = ttk.Button(self.mode_frame, text="分開查閱", command=lambda: self.load_and_display_logs("separate"))
        self.separate_button.pack(side="left", padx=10)
        
        # Create log display areas
        self.log_frame = ttk.Frame(self.root)
        self.log_frame.pack(expand=True, fill="both", padx=10, pady=10)
        
        self.software_log_text = tk.Text(self.log_frame, bg="light gray")
        self.software_log_text.pack(side="left", expand=True, fill="both")
        
        self.hardware_log_text = tk.Text(self.log_frame, bg="light blue")
        self.hardware_log_text.pack(side="left", expand=True, fill="both")
        
        self.software_log_scrollbar = ttk.Scrollbar(self.log_frame, command=self.software_log_text.yview)
        self.software_log_text.configure(yscrollcommand=self.software_log_scrollbar.set)
        self.software_log_scrollbar.pack(side="right", fill="y")
        
        self.hardware_log_scrollbar = ttk.Scrollbar(self.log_frame, command=self.hardware_log_text.yview)
        self.hardware_log_text.configure(yscrollcommand=self.hardware_log_scrollbar.set)
        self.hardware_log_scrollbar.pack(side="right", fill="y")
        
    def load_and_display_logs(self, mode):
        self.software_log_text.config(state="normal")
        self.hardware_log_text.config(state="normal")
        
        self.software_log_text.delete(1.0, "end")
        self.hardware_log_text.delete(1.0, "end")
        
        if mode == "integrated":
            software_logs = self.load_logs("weblogs.txt")
            hardware_logs = self.load_logs("hardlogs.txt")
            
            integrated_logs = "\n".join(software_logs + hardware_logs)
            self.software_log_text.insert("end", integrated_logs)
            
            self.hardware_log_text.pack_forget()  # 隱藏硬體日誌區塊
        
        elif mode == "separate":
            software_logs = self.load_logs("weblogs.txt")
            self.software_log_text.insert("end", software_logs)
            
            hardware_logs = self.load_logs("hardlogs.txt")
            self.hardware_log_text.insert("end", hardware_logs)
            
            self.software_log_text.pack(side="left", expand=True, fill="both")
            self.hardware_log_text.pack(side="left", expand=True, fill="both")
        
        self.software_log_text.config(state="disabled")
        self.hardware_log_text.config(state="disabled")
        
    def load_logs(self, filename):
        with open(filename, "r", encoding="utf-8") as file:
            logs = file.readlines()
        return logs
    
    def extract_timestamp(self, log):
        try:
            timestamp_str = log.split("[")[1].split("]")[0]
            print(timestamp_str)  # 確認 timestamp_str 的值是否正確
            timestamp = datetime.strptime(timestamp_str[:-18], "%a %b %d %Y %H:%M:%S")
        except IndexError:
            timestamp_str = log.split(":")[0].strip()
            print(timestamp_str)  # 確認 timestamp_str 的值是否正確
            timestamp = datetime.strptime(timestamp_str[:-18], "%a %b %d %Y %H:%M:%S")
        return timestamp
    
    def run(self):
        self.root.mainloop()

# Create and run the application
app = LogViewerApp()
app.run()