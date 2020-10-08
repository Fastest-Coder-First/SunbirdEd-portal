import { GroupMembershipType, GroupEntityStatus, Group } from '@project-sunbird/client-services/models/group';

export interface IGroup extends Group {
  isAdmin: boolean;
  active?: boolean;
}

export interface IMember {
  members: [
    {
      userId: string;
      role: string;
    }
  ];
}

export interface IGroupUpdate {
  name: string;
  membershipType?: GroupMembershipType;
  description?: string;
  status?: GroupEntityStatus;
}

export interface IGroupCard {
  name: string;
  description?: string;
  members?: Array<{}>;
  createdBy: string;
  cardBgColor?: any;
  cardTitleColor?: any;
  isLoading?: boolean;
  theme?: string;
  isAdmin?: boolean;
  initial?: string;
  id: string;
  isCreator?: boolean;
  memberRole?: string;
  active?: boolean;
}


export interface IGroupMemberConfig {
  showMemberCount: boolean;
  showSearchBox: boolean;
  showAddMemberButton: boolean;
  showMemberMenu: boolean;
}

export interface IGroupMember {
  identifier: string;
  initial: string;
  title: string;
  isAdmin: boolean;
  isMenu: boolean;
  indexOfMember: number;
  isCreator: boolean;
  userId: string;
  role: string;
  name: string;
  id?: string;
}

