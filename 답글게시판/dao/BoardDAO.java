package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import dto.BoardDTO;
import dto.PageDTO;
import module.jdbcConnector;

public class BoardDAO {
	
	private Connection conn;
	private PreparedStatement ppst;
	private ResultSet rs;
	
	public BoardDAO() {
		// TODO Auto-generated constructor stub
		try {
			conn = jdbcConnector.getConnection();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			
		}
	}// con END
	
	private void closeAll() {
		try {
			if(rs != null && !rs.isClosed()) rs.close();
			if(ppst != null && !ppst.isClosed()) ppst.close();
			if(conn != null && !conn.isClosed()) conn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public int insertOne(BoardDTO dto) {
		
		String sql = "insert into t_board"
					+ "(num, groupNum, replySeq, replyLevel,"
					+ "viewCnt, title, writer, contents, saveDate)"
					+ "values(t_board_seq.nextval, ?, ?, ?, ?, ?, ?, ?, sysdate)";
		int res = 0;
		
		try {
			ppst = conn.prepareStatement(sql);
//			groupNum : 대표글의 그룹번호
//			- 대표글의 시퀀스 값과 동일하게 설정할 예정
//			- 우선, 0으로 저장한 후 시퀀스 번호를 받아 수정할 예정
			ppst.setInt(1, 0);
			
//			replySeq : 답글들에 대한 순서를 나타내는 번호
//			- 대표글은 무조건 0으로 설정
//			- 최근 답글들이 무조건 1이 되도록 설정
			ppst.setInt(2, 0);
			
//			replyLevel : 대표글을 기준으로 답글들의 깊이 표현
//			- 대표글의 레벨은 0으로 설정
//			- 깊이가 증가할 수록 1증가
			ppst.setInt(3, 0);
			
//			viewCnt : 조회수
			ppst.setInt(4, 0);
			
			ppst.setString(5, dto.getTitle());
			ppst.setString(6, dto.getWriter());
			ppst.setString(7, dto.getContents());
			
			res = ppst.executeUpdate();
			
			if(res > 0)
			{
				sql = "update t_board set groupNum=num " 
						+ "where groupNum=0";
				ppst = conn.prepareStatement(sql);
				res = ppst.executeUpdate();
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			closeAll();
		}
		return res;
	}
	
	private int countRecord() {
		String sql = "select count(*) from t_board";
		int res = 0;
		try {
			ppst = conn.prepareStatement(sql);
			rs = ppst.executeQuery();
			rs.next();
			res = rs.getInt(1);		// 컬럼의 인덱스 지정 가능
		} catch (Exception e) {
			e.printStackTrace();
		}	// 일부러 close안했다!! 바로밑에 selectList에서 쓸거기때문에
		return res;
	}
	
	public ArrayList<BoardDTO> selectList(PageDTO pageDto) {
		
//		임시 SQL1
//		String sql = "select * from t_board order by num desc";
		
//		임시 SQL2
//		String sql = "select rownum rnum, tt.* from "
//		+ "(select * from t_board order by groupNum desc, replySeq asc) tt";
		
//		임시 SQL3
		String sql = "select * from "
				+ "(select rownum rnum, tt.* from "
						+ "(select * from t_board "
							+ "order by groupNum desc, "
								+ "replySeq asc) tt) where rnum>=? and rnum<=?";
		ArrayList<BoardDTO> listc = null;
		try {
			
			int cntAllRecord = countRecord();
			pageDto.sCountRecord(cntAllRecord);
			
			ppst = conn.prepareStatement(sql);
			ppst.setInt(1, pageDto.getStartNum());
			ppst.setInt(2, pageDto.getEndNum());
			
			rs = ppst.executeQuery();
			while(rs.next())
			{
				BoardDTO dto = new BoardDTO();
				dto.setShowNumberSeq(rs.getRow());
				dto.setNum(rs.getInt("num"));
				dto.setGroupNum(rs.getInt("groupNum"));
				dto.setReplySeq(rs.getInt("replySeq"));
				dto.setReplyLevel(rs.getInt("replyLevel"));
				dto.setViewCnt(rs.getInt("viewCnt"));
				dto.setTitle(rs.getString("title"));
				dto.setWriter(rs.getString("writer"));
				dto.setContents(rs.getString("contents"));
				dto.setSaveDate(rs.getDate("saveDate"));
				
				if(listc == null) listc = new ArrayList<>();
				listc.add(dto);
			}
			
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			closeAll();
		}
		return listc;
	}
	
	public int insertReply(BoardDTO dto) {
		int res = 0;
		
		try {
//			대표글의 정보 획득
			String sql = "select * from t_board where num=?";
			ppst = conn.prepareStatement(sql);
			ppst.setInt(1, dto.getNum());
			rs = ppst.executeQuery();
			
			int groupNum = -1;
			if(rs.next())
			{
				groupNum = rs.getInt("groupNum");
			}
			
//			대표글에 존재하는 답글의 replySeq 변경
//			=> 최근 답글을 무조건 1로 설정하기 위한 작업 진행
			sql = "update t_board set replySeq=replySeq+1 "
					+ "where groupNum=? and replySeq>0";
			ppst = conn.prepareStatement(sql);
			ppst.setInt(1, groupNum);
			res = ppst.executeUpdate();
			
			sql = "insert into t_board "
					+ "values(t_board_seq.nextval, ?, ?, ?, ?, ?, ?, ?, sysdate)";
			ppst = conn.prepareStatement(sql);
			ppst.setInt(1, groupNum);	// groupNum
			ppst.setInt(2, 1);			// replySeq
			ppst.setInt(3, 1);			// replyLevel
			ppst.setInt(4, 0);			// viewCnt
			ppst.setString(5, dto.getTitle());
			ppst.setString(6, dto.getWriter());
			ppst.setString(7, dto.getContents());
			
			res = ppst.executeUpdate();
			
			
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			closeAll();
		}
		return res;
	}
	
	
	
	
	
	
	
	
	
	
}// DAO END
