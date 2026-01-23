import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GroupService {

  baseUrl = 'http://localhost:5146/api/v1/group';


  constructor(private http: HttpClient) {}

  createGroup(name: string) {
    return this.http.post(`${this.baseUrl}/create`, {
      name,
      creatorId: localStorage.getItem('userId')
    });
  }

  createGroupWithMembers(name: string, memberIds: string[]) {
  return this.http.post<any>(
    'http://localhost:5146/api/v1/group/create-with-members',
    { name, memberIds }
  );
}



  getMyGroups() {
    return this.http.get<any[]>(
      `${this.baseUrl}/${localStorage.getItem('userId')}`
    );
  }

  getGroupMembers(groupId: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/${groupId}/members`
    );
  }

  addMember(groupId: string, userId: string) {
    return this.http.post(`${this.baseUrl}/add-member`, {
      groupId,
      userId,
      adminId: localStorage.getItem('userId')
    });
  }

  removeMember(groupId: string, userId: string) {
    return this.http.post(`${this.baseUrl}/remove-member`, {
      groupId,
      userId,
      adminId: localStorage.getItem('userId')
    });
  }

  changeRole(groupId: string, userId: string, role: number) {
    return this.http.post(`${this.baseUrl}/change-role`, {
      groupId,
      userId,
      role
    });
  }

  leaveGroup(groupId: string) {
    return this.http.post(`${this.baseUrl}/leave`, {
      groupId,
      userId: localStorage.getItem('userId')
    });
  }

  getGroupMessages(groupId: string) {
  return this.http.get<any[]>(
    `http://localhost:5146/api/v1/GroupChat/group/${groupId}`
  );
}


}
